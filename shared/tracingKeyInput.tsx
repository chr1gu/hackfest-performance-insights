import { useTracingKey } from "./storage";

export const TracingKeyInput = () => {
  const [tracingHeader, setTracingKey] = useTracingKey();

  return (
    <>
      <label style={{ display: "block", marginBottom: 8 }}>
        X-Dg-Tracing Key:
      </label>
      <input
        placeholder="Enter tracing key"
        style={{ width: "300px", padding: 8 }}
        onChange={(e) => {
          setTracingKey(e.target.value);
        }}
        defaultValue={tracingHeader}
      />
    </>
  );
};
