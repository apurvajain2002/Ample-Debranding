import { icon } from "../components/assets/assets";

export const layoutClass = (colProps) => {
    const layoutClasses = Object.entries(colProps).map(([key, value]) => `${key}${value}`).join(' ');
    return `col ${layoutClasses}`;
}

export const createKeyValueArray = (arr) => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.map((item, index) => ({
        key: item,
        value: item,
    }));
};

export const buttonClassandIcon = (type) => {
    const buttonType = type?.toLowerCase();

    // Mapping object for button types
    const buttonMapping = {
        sent: {
            icon: icon.exportShareIcon,
            buttonClass: 'sent-btn',
        },
        delivered: {
            icon: icon.emailInvitationInviteIcon,
            buttonClass: 'delivered-btn',
        },
        read: {
            icon: icon.instructionIcon,
            buttonClass: 'read-btn',
        },
        bounced: {
            icon: icon.instructionIcon,
            buttonClass: 'bounced-btn',
        },
        failed: {
            icon: icon.failedIcon,
            buttonClass: 'failed-btn',
        },
        clicked: {
            icon: icon.linkIcon,
            buttonClass: 'clicked-btn',
        },
    };

    // Return the matching object or a default value
    return buttonMapping[buttonType] || {
        icon: icon.exportShareIcon,
        buttonClass: 'sent-btn',
    };
};

export function formatFileNamesForTemplates(filePaths) {
    return filePaths.map((filePath) => {
        const fileName = filePath.split("/").pop() || "";
        const formattedName = fileName
            .replace(/^\d+-/, "")       // Remove leading digits and dash
            .replace(".docx", "")       // Remove extension
            .replace(/_/g, " ");        // Replace underscores with spaces

        return {
            name: formattedName,
            value: filePath
        };
    });
}

export const mergeAndRemoveDuplicates = (existing, newItems) => {
    const map = new Map();

    [...existing, ...newItems].forEach(item => {
        map.set(item.value, item); // Ensures only unique values (latest wins)
    });

    return Array.from(map.values());
};

export function generateTemplateOptions(templates) {
    const unique = new Map();

    templates.forEach(({ name }) => {
        if (!unique.has(name)) {
            unique.set(name, {
                optionKey: name,
                optionValue: name,
            });
        }
    });

    return [
        { optionKey: "Select template", optionValue: "" },
        ...Array.from(unique.values()),
    ];
}

export function getCurrentAndFutureDate() {
    const now = new Date();
    const future = new Date(now.getTime() + 48 * 60 * 60 * 1000); // Add 48 hours

    const formatDateParts = (date) => ({
        day: date.getDate(),
        month: date.getMonth() + 1, // getMonth is 0-indexed
        year: date.getFullYear(),
        // hour: date.getHours().toString(),
        // minute: date.getMinutes().toString()
        hour: '0',
        minute: '0',
    });

    return {
        currentDate: now,
        futureDate: future,
        currentDateParts: formatDateParts(now),
        futureDateParts: formatDateParts(future)
    };
}

export const manpowerStatuses = [
    "",
    "Filter Rejected",
    "",
    "R1 Shortlisted",
    "R2 Not Rated",
    "R2 Rejected",
    "R2 Longlisted",
    "R2 Shortlisted",
    "L3 Rejected",
    "L3 Longlisted",
    "L3 Shortlisted",
    "Candidate Dropout",
    "Offered",
    "Not Joined",
    "Joined"
];

export const wait200ms = () => new Promise(resolve => setTimeout(resolve, 200));