function bytesToSize(bytes) {
	let i = Math.floor(Math.log(bytes) / Math.log(1024)),
		sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
	return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + " " + sizes[i];
}

const createElement = (tag, classes = [], content) => {
	const node = document.createElement(tag);

	if (classes.length) {
		node.classList.add(...classes);
	}

	if (content) {
		node.textContent = content;
	}

	return node;
};

const noop = function () {

}

export function upload(selector, options = {}) {
	let files = [];
	const onUpload = options.onUpload ?? noop
	const input = document.querySelector(selector);
	const preview = createElement("div", ["preview"]);

	const openBtn = createElement("button", ["btn"], "Открыть");
	const uploadBtn = createElement("button", ["btn", "primary"], "Загрузить");
	uploadBtn.style.display = "none";

	if (options.multi) {
		input.setAttribute("multiple", true);
	}

	if (options.accept && Array.isArray(options.accept)) {
		input.setAttribute("accept", options.accept.join(","));
	}

	input.insertAdjacentElement("afterend", preview);
	input.insertAdjacentElement("afterend", uploadBtn);
	input.insertAdjacentElement("afterend", openBtn);

	const triggerInput = () => input.click();

	const changeHandler = (event) => {
		if (!event.target.files.length) {
			return;
		}
		// const files = event.target.files деструктуризация, равносильно строчке  const {files} = event.target
		files = Array.from(event.target.files);

		preview.innerHTML = "";
		uploadBtn.style.display = "inline-block";

		files.forEach((file) => {
			if (!file.type.match("image")) {
				return;
			}

			const reader = new FileReader();

			reader.onload = (event) => {
				// Т.к операция асинхронная, добавляем обработчик события

				const source = event.target.result;
				preview.insertAdjacentHTML(
					"afterbegin",
					`<div class = "preview-image">
					<div class = "preview-remove" data-name="${file.name}">&times;</div>
						<img	src="${source}" alt = "${file.name}"/>
						<div class ="preview-info">
							<span>${file.name}</span>
							<span>${bytesToSize(file.size)}</span>
						</div>
					</div>`,
				);
			};

			reader.readAsDataURL(file);
		});
	};

	const removeHandler = (event) => {
		if (!event.target.dataset.name) {
			return;
		}
		const { name } = event.target.dataset;
		// const name = event.target.dataset.name
		files = files.filter((file) => file.name !== name);

		if (!files.length) {
			uploadBtn.style.display = "none";
		}

		const block = preview
			.querySelector(`[data-name = "${name}"]`)
			.closest(".preview-image");
		block.classList.add("removing");
		setTimeout(() => block.remove(), 200);
	};

	const clearPreview = element => {
		element.style.bottom = '0'
		element.innerHTML = '<div class= "preview-info-progress"></div>'
	}

	const uploadHandler = () => {
		preview.querySelectorAll('.preview-remove').forEach(element => element.remove())
		const previewInfo = preview.querySelectorAll('.preview-info')
		previewInfo.forEach(clearPreview)
		onUpload(files)
	};

	openBtn.addEventListener("click", triggerInput);
	input.addEventListener("change", changeHandler);
	preview.addEventListener("click", removeHandler);
	uploadBtn.addEventListener("click", uploadHandler);
}
