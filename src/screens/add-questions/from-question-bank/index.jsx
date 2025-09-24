import { useState } from "react";
import NormalInputField from "../../../components/input-fields/normal-input-field";
import SelectInputField from "../../../components/input-fields/select-input-field";
import CheckboxInputField from "../../../components/input-fields/checkbox-input-field";
import NormalButton from "../../../components/buttons/normal-button";
import TableComponent from "../../../components/table-components/table-component";
import IconTooltip from "../../../components/miscellaneous/icon-tooltip";
import getUniqueId from "../../../utils/getUniqueId";
import { roundsData } from "../../../resources/constant-data/roundsData";

const questionBankDummyData = [
  {
    selected: false,
    questionDescription: `Describe to me, the methods of dimensionality reduction
    that you know. Explain one of these, that you have
    practically used`,
    domainSkill: "JavaScript",
    questionType: "Open Script",
  },
  {
    selected: false,
    questionDescription: `What to your mind is the significance of P Calue in
    regression analysis? Explain to me with an example`,
    domainSkill: "PHP",
    questionType: "MCQ",
  },
  {
    selected: false,
    questionDescription: `Explain to me, how would you use python, to find the
    distribution of the dependent variable`,
    domainSkill: "MySQL",
    questionType: "OSRT",
  },
  {
    selected: false,
    questionDescription: `To your understanding, which packages can be used in Python do display the Confusion Matrix? Explain to me, any package that you have practically used`,
    domainSkill: "Java",
    questionType: "CSRT",
  },
  {
    selected: false,
    questionDescription: `You are given a data set consisting of variables with more than 30 percent missing values. How will you deal with them?`,
    domainSkill: "Angular",
    questionType: "FQ",
  },
  {
    selected: false,
    questionDescription: `Describe to me, the methods of dimensionality reduction
    that you know. Explain one of these, that you have
    practically used`,
    domainSkill: "JavaScript",
    questionType: "Open Script",
  },
  {
    selected: false,
    questionDescription: `What to your mind is the significance of P Calue in
    regression analysis? Explain to me with an example`,
    domainSkill: "PHP",
    questionType: "MCQ",
  },
  {
    selected: false,
    questionDescription: `Explain to me, how would you use python, to find the
    distribution of the dependent variable`,
    domainSkill: "MySQL",
    questionType: "OSRT",
  },
  {
    selected: false,
    questionDescription: `To your understanding, which packages can be used in Python do display the Confusion Matrix? Explain to me, any package that you have practically used`,
    domainSkill: "Java",
    questionType: "CSRT",
  },
  {
    selected: false,
    questionDescription: `You are given a data set consisting of variables with more than 30 percent missing values. How will you deal with them?`,
    domainSkill: "Angular",
    questionType: "FQ",
  },
  {
    selected: false,
    questionDescription: `Describe to me, the methods of dimensionality reduction
    that you know. Explain one of these, that you have
    practically used`,
    domainSkill: "JavaScript",
    questionType: "Open Script",
  },
  {
    selected: false,
    questionDescription: `What to your mind is the significance of P Calue in
    regression analysis? Explain to me with an example`,
    domainSkill: "PHP",
    questionType: "MCQ",
  },
];

const skillsData = [
  {
    heading: "Web Development",
    subHeading: [
      "DOTNET CORE",
      "PostgreSQL",
      "ADONET",
      "Advanced Java",
      "AIX",
      "Angular JS",
      "Ansible Playbook",
      "Apache NiFi Flow",
      "Apache Server",
      "ASP DOTNET",
      "AWS Devops",
      "Backend Development",
      "Big Data",
      "Big Data Hadoop I",
      "Big Data Hadoop II",
      "Big Data Hadoop III",
      "Blockchain",
      "BRD",
    ],
  },
  {
    heading: "Operations",
    subHeading: [
      "DOTNET CORE",
      "PostgreSQL",
      "ADONET",
      "Advanced Java",
      "AIX",
      "Angular JS",
      "Ansible Playbook",
      "Apache NiFi Flow",
      "Apache Server",
      "ASP DOTNET",
      "AWS Devops",
      "Backend Development",
      "Big Data",
      "Big Data Hadoop I",
      "Big Data Hadoop II",
      "Big Data Hadoop III",
      "Blockchain",
      "BRD",
    ],
  },
  {
    heading: "Industry Domain Knowledge",
    subHeading: [
      "DOTNET CORE",
      "PostgreSQL",
      "ADONET",
      "Advanced Java",
      "AIX",
      "Angular JS",
      "Ansible Playbook",
      "Apache NiFi Flow",
      "Apache Server",
      "ASP DOTNET",
      "AWS Devops",
      "Backend Development",
      "Big Data",
      "Big Data Hadoop I",
      "Big Data Hadoop II",
      "Big Data Hadoop III",
      "Blockchain",
      "BRD",
    ],
  },
  {
    heading: "Mobile Development",
    subHeading: [
      "DOTNET CORE",
      "PostgreSQL",
      "ADONET",
      "Advanced Java",
      "AIX",
      "Angular JS",
      "Ansible Playbook",
      "Apache NiFi Flow",
      "Apache Server",
      "ASP DOTNET",
      "AWS Devops",
      "Backend Development",
      "Big Data",
      "Big Data Hadoop I",
      "Big Data Hadoop II",
      "Big Data Hadoop III",
      "Blockchain",
      "BRD",
    ],
  },
];

const FromQuestionBank = () => {
  const [filters, setFilters] = useState({
    questionType: "",
    experienceLevel: "",
    interviewRound: "",
    defaultLanguage: "",
    searchValue: "",
    showRows: "",
  });
  const [questions, setQuestions] = useState(questionBankDummyData);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const [showRows, setShowRows] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(15);
  const [loading, setLoading] = useState(false);

  const handleOnChangeFilters = (e) => {
    setFilters(() => ({
      ...filters,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckboxChange = (index) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        selected: !updatedQuestions[index].selected,
      };
      return updatedQuestions;
    });
  };

  const handleAddQuestionsToJob = () => {
    const array = questions.filter((question) => question.selected);
    setSelectedQuestions(array);
  };

  return (
    <>
      <section className="body-box-body body-bg qsb-bg">
        <div className="row">
          <SelectInputField
            divTagCssClasses="input-field col xl3 l4 m4 s12"
            selectTagIdAndName="questionType"
            options={[
              {
                optionKey: "Select Question Type",
                optionValue: "Select Question Type",
              },
              { optionKey: "By Role", optionValue: "role" },
              { optionKey: "By Domain Skill", optionValue: "domainSkill" },
              { optionKey: "By Soft Skill", optionValue: "softSkill" },
            ]}
            value={filters.questionType}
            onChange={(e) => handleOnChangeFilters(e)}
            labelText={"Search Question Bank"}
          />
          <SelectInputField
            divTagCssClasses="input-field col xl3 l4 m4 s12"
            selectTagIdAndName="experienceLevel"
            options={[
              {
                optionKey: "Select Experience Level",
                optionValue: "Select Experience Level",
              },
              { optionKey: "Entry Level", optionValue: "Entry level" },
              { optionKey: "Mid level", optionValue: "Mid level" },
              { optionKey: "Skilled level", optionValue: "Skilled level" },
            ]}
            value={filters.experienceLevel}
            onChange={(e) => handleOnChangeFilters(e)}
            labelText={"Choose Experience Level"}
          />
          <SelectInputField
            divTagCssClasses="input-field col xl3 l4 m4 s12"
            selectTagIdAndName="interviewRound"
            options={[
              {
                optionKey: "Select Interview Round",
                optionValue: "Select Interview Round",
              },
              {
                optionKey: roundsData.secondRound.name,
                optionValue: roundsData.secondRound.name,
              },
              {
                optionKey: roundsData.firstRound.name,
                optionValue: roundsData.firstRound.name,
              },
            ]}
            value={filters.interviewRound}
            onChange={(e) => handleOnChangeFilters(e)}
            labelText={"Choose Interview Round"}
          />
          <SelectInputField
            divTagCssClasses="input-field col xl3 l4 m4 s12"
            selectTagIdAndName="defaultLanguage"
            options={[
              {
                optionKey: "Select Language",
                optionValue: "Select Language",
              },
              { optionKey: "Hindi", optionValue: "Hindi" },
              { optionKey: "English", optionValue: "English" },
              { optionKey: "Odiya", optionValue: "Odiya" },
            ]}
            value={filters.defaultLanguage}
            onChange={(e) => handleOnChangeFilters(e)}
            labelText={"Choose Default Language"}
          />
          <NormalInputField
            divTagCssClasses="input-field col xl6 l6 m6 s12"
            inputTagCssClasses="search-receiver"
            inputTagIdAndName={"searchValue"}
            placeholder={"What are you looking for"}
            value={filters.searchValue}
            onChange={(e) => handleOnChangeFilters(e)}
          />
          <div className="input-field col xl3 l3 m3 s12">
            <NormalButton
              buttonTagCssClasses={"btn-clear btn-submit"}
              buttonText={"Submit"}
              onClick={() => handleAddQuestionsToJob()}
            />
          </div>
        </div>
      </section>

      <section className="body-box-body questionfound-body">
        <section className="row row-margin">
          <aside className="col xl3 l3 m4 s12">
            <div className="acd-warpper">
              <div className="colapse-header">
                Domain Skills{" "}
                <IconTooltip
                  children={"i"}
                  dataTooltip="Experience Entry Level"
                />
              </div>
              <ul className="collapsible">
                {skillsData.map((skill, index) => (
                  <li key={getUniqueId()}>
                    <div className="collapsible-header">{skill.heading}</div>
                    <div className="collapsible-body">
                      <ul className="colapse-ul">
                        {skill.subHeading.map((item, index) => (
                          <li className="skillSubHeading" key={getUniqueId()}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          {/* <!-- End Left side--> */}

          <aside className="col xl9 l9 m8 s12">
            <div className="qsdescription-wr">
              <TableComponent
                showTableComponentHeader={false}
                showRows={showRows}
                setShowRows={setShowRows}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalItems={totalItems}
                setTotalItems={setTotalItems}
                loading={loading}
                setLoading={setLoading}
                tableHeadValues={[
                  "Select Question",
                  "Question Description",
                  "Domain Skill",
                  "Question Type",
                ]}
              >
                {questions.map((item, index) => (
                  <tr key={getUniqueId()}>
                    <td>
                      <CheckboxInputField
                        inputTagIdAndName={`selected${index}`}
                        checked={item.selected}
                        onChange={() => {
                          handleCheckboxChange(index);
                        }}
                      />
                    </td>
                    <td>{item.questionDescription}</td>
                    <td>{item.domainSkill}</td>
                    <td>{item.questionType}</td>
                  </tr>
                ))}
              </TableComponent>
            </div>
          </aside>
        </section>
      </section>
    </>
  );
};

export default FromQuestionBank;
