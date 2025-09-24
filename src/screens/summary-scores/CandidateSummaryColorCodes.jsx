const CandidateSummaryColorCodes = () => (
    <aside className="col m12">
        <ul className="box-color-ul box-color-head summary-scores-color-ul padding-0 summary-scores-ul-margin">
            <li className="summary-scores-color-li">
                <span className="box-color header-box-color available" />
                Available
            </li>
            <li className="summary-scores-color-li">
                <span className="box-color header-box-color can-consider" />
                Can Consider
            </li>
            <li className="summary-scores-color-li">
                <span className="box-color header-box-color rejected" />
                Rejected
            </li>
            <li className="summary-scores-color-li">
                <span className="box-color header-box-color shortlisted" />
                Shortlisted
            </li>
            <li className="summary-scores-color-li">
                <span className="box-color header-box-color not-rated" />
                Not rated
            </li>
        </ul>
    </aside>
);

export default CandidateSummaryColorCodes;