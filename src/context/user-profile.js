import { useState } from "react";


export const useUserProfileContext = () => {

    const initialUserProfile = {
        firstName: '',
        lastName: '',
        whatsappNumber: '',
        mobileNumber1: '',
        mobileNumber2: '',
        currentLocation: '',
        // username: '',
        primaryEmailId: '',
        secondaryEmailId: '',
        currentCTC: '',
        fixedCTC: '',
        variableCTC: '',
        noticePeriod: '',
        // totalExperience: '',
        // higherEducation: '',
        dateOfBirth: '',
        negotiableNoticePeriod: '',
        workExperience: [ {
            workExperienceId: 1,
            userId: '',
            organizationName: '',
            designation: '',
            startDate: '',
            endDate: '',
            workLocation: '',
            description: '',
            currentOrganization: false,
        } ],
        userAcademics: [{
            userAcademicId: 1,
            userId: null,
            universityName: '',
            degreeName: '',
            startDate: '',
            endDate: '',
            cgpa: '',
            levelOfEducation: '',
        }],
        /* userSkills: [{
            userId: '',
            skillType: '',
            skillName: '',
            skillRating: '',
        }], */
        userSocialProfileDTO: {
            userSocialId: 1,
            linkedInProfile: '',
            stackOverflowProfile: '',
            facebookProfile: '',
            twitterProfile: '',
            githubUsername: '',
            personalWebsite: '',
            blogUrl: '',
            userId: '',
            photoUrl: null,
            resumeUrl: null
        }
    }

    const [userProfile, setUserProfile] = useState(initialUserProfile);
    const [userPhoto, setUserPhoto] = useState(null);
    const [userCV, setUserCV] = useState(null);
    

    return {
        userProfile, setUserProfile, initialUserProfile,userPhoto,setUserPhoto,userCV,setUserCV
    }
}