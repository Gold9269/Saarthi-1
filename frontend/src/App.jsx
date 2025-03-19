import React, { useState, useEffect, createContext, useContext } from "react";

// Context API for state management
const FormContext = createContext();
export const useForm = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
  const [fields, setFields] = useState(
    JSON.parse(localStorage.getItem("formFields")) || []
  );

  useEffect(() => {
    localStorage.setItem("formFields", JSON.stringify(fields));
  }, [fields]);

  return (
    <FormContext.Provider value={{ fields, setFields }}>
      {children}
    </FormContext.Provider>
  );
};

export const FormBuilder = () => {
  const { fields, setFields } = useForm();
  const fieldTypes = ["text", "number", "date", "checkbox"];

  const addField = (type) => {
    setFields([...fields, { id: Date.now(), type, label: "", required: false }]);
  };

  const updateField = (id, key, value) => {
    setFields(
      fields.map((field) => (field.id === id ? { ...field, [key]: value } : field))
    );
  };

  const removeField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  return (
    <div>
      <h2>Form Builder</h2>
      <div>
        {fieldTypes.map((type) => (
          <button key={type} onClick={() => addField(type)}>
            Add {type}
          </button>
        ))}
      </div>
      <div>
        {fields.map((field, index) => (
          <div key={field.id}>
            <input
              type="text"
              placeholder="Label"
              value={field.label}
              onChange={(e) => updateField(field.id, "label", e.target.value)}
            />
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => updateField(field.id, "required", e.target.checked)}
            /> Required
            <button onClick={() => removeField(field.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RenderForm = () => {
  const { fields } = useForm();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    let newErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Form submitted successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Generated Form</h2>
      {fields.map((field) => (
        <div key={field.id}>
          <label>{field.label}</label>
          {field.type !== "checkbox" ? (
            <input
              type={field.type}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
          ) : (
            <input
              type="checkbox"
              onChange={(e) => handleChange(field.id, e.target.checked)}
            />
          )}
          {errors[field.id] && <p style={{ color: "red" }}>{errors[field.id]}</p>}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

const App = () => {
  return (
    <FormProvider>
      <FormBuilder />
      <RenderForm />
    </FormProvider>
  );
};

export default App;
