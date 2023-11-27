import { useEffect, useState } from "react";
import { FieldCheckbox, FieldRadio, FieldText } from "./Fields";
import "./App.css";

// Takeaways
// 💡 Familiarize yourself with the APIs you are working with (URLSearchParams, Set, etc)
// ❌ Avoid RDD/BDD! (Refresh/Browser Driven Development, not Behaviour) */}

// TODO:
// clean up!

type FormValues = {
  base: string[] | string;
  flavor: string[] | string;
  toppings: string[] | string;
};

type FormKey = keyof FormValues;

// Capture form values and get a share link
// with url params
export default function App() {
  const [formValues, setFormValues] = useState<FormValues>({
    base: "",
    flavor: "",
    toppings: "",
  });

  useEffect(() => {
    const url = new URLSearchParams(window.location.search);
    // type key checking if it's a radio, checkbox, etc.
    // great fit for zod
    for (const [key, value] of url.entries()) {
      setFormValues((prev) => ({
        ...prev,
        [key]:
          prev[key] && prev[key] !== value
            ? [
                ...new Set(
                  [
                    Array.isArray(prev[key]) ? [...prev[key]] : prev[key],
                    value,
                  ].flat()
                ),
              ]
            : value,
      }));
    }
  }, []);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentSearch = window.location.search;
    const url = new URLSearchParams(currentSearch);
    url.set(e.target.name, e.target.value);
    window.history.pushState(null, "", `?${url.toString()}`);
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentSearch = window.location.search;
    const url = new URLSearchParams(currentSearch);
    const { name, value } = e.target;
    if (e.target.checked) {
      url.append(e.currentTarget.name, e.currentTarget.value);
      setFormValues((prev) => ({
        ...prev,
        [name]: Array.isArray(prev[name as FormKey])
          ? [...prev[name], value]
          : [value],
      }));
    } else {
      url.delete(name, value);
      setFormValues((prev) => ({
        ...prev,
        [name]: prev[name as FormKey].filter((val) => val !== value),
      }));
    }
    window.history.pushState(null, "", `?${url.toString()}`);
  };

  return (
    <div className="App">
      <h1>Icecream order</h1>

      <form>
        <fieldset>
          <legend>Base</legend>
          <FieldRadio
            onChange={handleRadioChange}
            name="base"
            value="cone"
            label="Cone"
            checked={formValues["base"] === "cone"}
          />
          <FieldRadio
            onChange={handleRadioChange}
            name="base"
            value="cup"
            label="Cup"
            checked={formValues["base"] === "cup"}
          />
        </fieldset>

        <fieldset>
          <legend>Flavor</legend>
          <FieldCheckbox
            onChange={handleCheckboxChange}
            checked={
              Array.isArray(formValues["flavor"])
                ? formValues["flavor"].includes("choco")
                : formValues["flavor"] === "choco"
            }
            name="flavor"
            value="choco"
            label="Choco"
          />
          <FieldCheckbox
            onChange={handleCheckboxChange}
            checked={
              Array.isArray(formValues["flavor"])
                ? formValues["flavor"].includes("vanilla")
                : formValues["flavor"] === "vanilla"
            }
            name="flavor"
            value="vanilla"
            label="Vanilla"
          />
          <FieldCheckbox
            onChange={handleCheckboxChange}
            checked={
              Array.isArray(formValues["flavor"])
                ? formValues["flavor"].includes("Dulce de leche")
                : formValues["flavor"] === "Dulce de leche"
            }
            name="flavor"
            value="Dulce de leche"
            label="Dulce de leche"
          />
          <FieldCheckbox
            onChange={handleCheckboxChange}
            checked={
              Array.isArray(formValues["flavor"])
                ? formValues["flavor"].includes("cup")
                : formValues["flavor"] === "cup"
            }
            name="flavor"
            value="cup"
            label="Cup"
          />
        </fieldset>

        <fieldset>
          <legend>Toppings</legend>
          <div style={{ marginBottom: 10 }}>You can add multiple toppings</div>

          {(Array.isArray(formValues["toppings"])
            ? formValues["toppings"]
            : [formValues["toppings"]]
          ).map((value, idx, arr) => {
            console.log("value:", value, arr);
            return (
              <FieldText
                key={idx}
                onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const isLastField =
                    !Array.isArray(formValues["toppings"]) ||
                    Number(formValues["toppings"].length) - 1 === idx;
                  console.log("here", formValues["toppings"], idx);
                  if (isLastField && e.target.value) {
                    setFormValues((prev) => {
                      return {
                        ...prev,
                        toppings: [
                          ...(Array.isArray(prev.toppings)
                            ? prev.toppings
                            : []),
                          "",
                        ],
                      };
                    });
                  }
                  const currentSearch = window.location.search;
                  const url = new URLSearchParams(currentSearch);
                  url.delete("toppings");
                  Array.isArray(formValues["toppings"]) &&
                    formValues["toppings"].forEach((topping) => {
                      if (topping) {
                        url.append("toppings", topping);
                      }
                    });
                  window.history.pushState(null, "", `?${url.toString()}`);
                }}
                id="choco"
                label={`Topping #${idx + 1}`}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormValues((prev) => {
                    const toppings = Array.isArray(prev["toppings"])
                      ? prev["toppings"].slice(0)
                      : "";
                    console.log("toppings:", prev, toppings, e.target.value);
                    return {
                      ...prev,
                      toppings: Array.isArray(toppings)
                        ? toppings.map((topping, i) =>
                            i === idx ? e.target.value : topping
                          )
                        : e.target.value,
                    };
                  });
                }}
              />
            );
          })}
        </fieldset>
      </form>

      <br />

      {/*
        - TODO 2/3: Update the URL with the icecream fields.
        - TODO 2/3: On mount, prefill the fields based on the URL. */}
      <button>Share with a friend</button>
    </div>
  );
}
