const scanner = require('sonarqube-scanner').default;
scanner(
    {
        serverUrl: "https://sonar.evueme.dev/",
        options: {
            "sonar.login": "keshav",
            "sonar.password": "P@ssw0rd",
            "sonar.projectName": "evueme-frontend",
            "sonar.projectDescription": "Just for demo...",
            "sonar.sourceEncoding":"UTF-8",
            "sonar.sources": "./src",
            "sonar.test.inclusions": "**/*.test.tsx,**/*.test.ts",
            "sonar.exclusions": "**/*.test.tsx",
            "sonar.tests":"./src",
            "sonar.testExecutionReportPaths":"test-report.xml",
            "sonar.javascript.lcov.reportPaths":"coverage/lcov.info"
        },
    },
    () => process.exit()
);