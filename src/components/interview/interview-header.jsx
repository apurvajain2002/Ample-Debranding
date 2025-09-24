import { icon } from "../assets/assets";
import EvuemeImageTag from "../evueme-html-tags/Evueme-image-tag";
import { useGlobalContext } from "../../context";

const InterviewHeader = () => {
	const { interviewJobName, rootColor } = useGlobalContext();
	return (
		<header className="int-header">
			<aside className="col xl8 l8 m8 s8" style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "10px" }}>
				<div className="int-logo-brand">
					<EvuemeImageTag imgSrc={rootColor.logoUrl} altText="brand logo image" />
				</div>
				{interviewJobName && <h2 style={{ fontSize: "20px", fontWeight: "semibold", margin: "0" }}>{interviewJobName}</h2>}
			</aside>
		</header>
	)
}

export default InterviewHeader;
