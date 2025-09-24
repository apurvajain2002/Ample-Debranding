import EvuemeImageTag from "../evueme-html-tags/Evueme-image-tag";

const CLASS_FOR_STATUS = {
	"Joined": "",
	"Offered": "offered",
	"L2 Shortlisted": "l2shortlisted",
	"L1 Shortlisted": "l1shortlisted",
	"L3 Shortlisted": "l3shortlisted",
	"HR Shortlisted": "hrshortlisted",
	"Can Consider": "canconsider",
	"Rejected": "reject"
}

const CandidateProfile = ({ name, status, imgSrc, link = "#", score }) => {
	return (
		<a href={link} style={{minHeight:'50px'}}>
			<EvuemeImageTag
				className={"candidate-profile-img"}
				imgSrc={imgSrc}
			/>
			<h5>{name}</h5>
			<p>{status}</p>
			<span className={`score ${CLASS_FOR_STATUS[status]}`}>{score}</span>
		</a>
	)
}

export default CandidateProfile;
