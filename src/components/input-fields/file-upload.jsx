import { useRef } from "react";
import { icon } from "../assets/assets";
import NormalInputField from "./normal-input-field";
import EvuemeImageTag from "../evueme-html-tags/Evueme-image-tag";
import EvuemeLoader from "../loaders/evueme-loader";

export function FileUploadInput({
	divTagCssClasses = "",
	onClick,
	inputTagCssClasses = "",
	idAndName,
	placeholder = "Upload file",
	value = "",
	onChange,
	leftIconSrc = "",
	leftIconCss = "",
	label = "Upload File",
	required = false,
	accept = ".pdf,.docx",
	uploadStatus = "",
	onReset = () => { },
	loading = false,
}) {
	const fileRef = useRef(null);

	const rightIcon = uploadStatus ? {
		rightIconSrc: icon.deleteIcon,
		rightIconAltText: "Reset file",
		rightIconCss: "file-upload-delete-icon",
		onClickRightIcon: onReset
	} : {}

	console.log(uploadStatus);

	return (
		<>
			{loading ? <EvuemeLoader /> : null}
			<div>
				<input
					type="file"
					ref={fileRef}
					id={idAndName}
					name={idAndName}
					hidden
					accept={accept}
					onChange={onChange}
				/>
				<NormalInputField
					divTagCssClasses={`input-field file-upload-field ${divTagCssClasses}`}
					onClick={() => {
						onClick(fileRef)
						fileRef.current.value = null;
					}}
					inputTagCssClasses={`validate ${inputTagCssClasses}`}
					inputTagIdAndName={idAndName}
					placeholder={placeholder}
					value={value} // Show only the file name here, not the base64 data
					labelText={label}
					required={required}
					leftIconSrc={leftIconSrc}
					leftIconCss={leftIconCss}
					// {...rightIcon}
					style={{ cursor: "pointer" }}
				/>
				{uploadStatus === "" ? null : uploadStatus ?
					<div class="file-upload-status" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between',}}>
					<span className=" show-success">File uploaded successfully!</span>
					<i className=" carretColor-transparent" style={{
						padding:'.2rem 0.7rem 0 0'
					}}>
						<EvuemeImageTag

							imgSrc={icon.deleteIcon}
							altText="Reset file"
							className="file-upload-delete-icon"
							onClick={onReset}

						/>
					</i>
				</div> :
					<span className="file-upload-status show-failure">File upload failed!</span>
				}
			</div>
		</>
	);
}
