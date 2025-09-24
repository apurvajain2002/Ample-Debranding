import { layoutClass } from "../../../utils/functions";

const CustomSelectField = ({
    label = '',
    parentClass = "",
    selectClass = "",
    labelClass = "",
    register,
    register: { name = "" } = {},
    error = null,
    disabled = false,
    options = [],
    isRequired = false,
    layout = {},
    defaultOption = {},
    ...props
}) => {
    const { id } = props;
    const errorMessage = error ? error.message : "";

    // Set the default name based on the provided defaultOption or label
    const defaultName = defaultOption.name ?? `Select ${label}`;

    const defaultLayout = { xl: 3, l: 3, m: 4, s: 12 };
    const mergedLayout = { ...defaultLayout, ...layout };

    const optionsMapper = (option) => (
        <option key={option.value} value={option.value}>
            {option.key}
        </option>
    );

    return (
        <aside className={`input-field ${layoutClass(mergedLayout)} ${parentClass} ${errorMessage ? "select-missing-value" : ""}`}>
            <select
                className={selectClass}
                id={id || name || ""}
                disabled={disabled}
                {...register}
                {...props}
            >
                {defaultOption.show && (
                    <option value={defaultOption.value ?? ""}>{defaultName}</option>
                )}
                {Array.isArray(options) && options.length > 0 && options.map(optionsMapper)}
            </select>
            {label && (
                <label htmlFor={name} className={`labelCss ${labelClass}`}>
                    {label} {isRequired && <span className="required">*</span>}
                </label>
            )}
            {errorMessage && <div className="error-msg">{errorMessage}</div>}
        </aside>
    );
};

export default CustomSelectField;