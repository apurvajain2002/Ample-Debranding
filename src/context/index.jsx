import { createContext, useContext, useState } from "react";
import { image } from "../components/assets/assets";
import { useUserProfileContext } from "./user-profile";

const GlobalContext = createContext(null);

export const GlobalContextProvider = ({ children }) => {
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [isTableHeaderChecked, setIsTableHeaderChecked] = useState(false);
    const handleTableHeaderCheckbox = (payload, allCandidateIds = []) => {
        setIsTableHeaderChecked(payload);
        if (!payload) {
            setSelectedCandidates([]);
        } else {
            // When checking, select all candidates
            setSelectedCandidates(allCandidateIds);
        }
    }
    const [allCombinedTemplates, setAllCombinedTemplates] = useState([]);
    const [privateUserId, setPrivateUserId] = useState("");
    const [interviewJobName, setInterviewJobName] = useState("");
    const [interviewSource, setInterviewSource] = useState("");
    const hostname = window.location.hostname?.split(".")[0] || 'ev';
    const dynamicColorPage = {
        logoUrl: image.brandEvuemeStrategicPartnerLogo,
        primary: '#b99750',
        secondary: '#3b0532'
    }
    const [rootColor, setRootColor] = useState({
        logoUrl: dynamicColorPage.logoUrl,
        primary: dynamicColorPage.primary,
        secondary: dynamicColorPage.secondary
    });
    const [candidatesToInvite, setCandidatesToInvite] = useState("");
    const [userEditProfilePageYN, setUserEditProfilePageYN] = useState(false);
    const [ipDetails, setIpDetails] = useState(null);
    const [browserInfo, setBrowserInfo] = useState(null);
    const [deviceInfo, setDeviceInfo] = useState(null);
    const [featureSupport, setFeatureSupport] = useState(null);

    const { ...userProfile } = useUserProfileContext();

    return (
        <GlobalContext.Provider value={{
            isTableHeaderChecked, handleTableHeaderCheckbox,
            selectedCandidates, setSelectedCandidates,
            allCombinedTemplates, setAllCombinedTemplates,
            privateUserId, setPrivateUserId,
            interviewJobName, setInterviewJobName,
            rootColor, setRootColor,
            interviewSource, setInterviewSource,
            candidatesToInvite, setCandidatesToInvite,
            dynamicColorPage,
            hostname: hostname === 'localhost' ? 'ev' : hostname,
            userEditProfilePageYN, setUserEditProfilePageYN,
            ipDetails, setIpDetails,
            browserInfo, setBrowserInfo,
            deviceInfo, setDeviceInfo,
            featureSupport, setFeatureSupport,
            ...userProfile
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context must be used within its provider");
    return context;
};