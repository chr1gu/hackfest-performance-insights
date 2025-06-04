import { TracingKeyInput } from "~shared/tracingKeyInput";

function IndexPopup() {
  return (
    <div
      style={{
        padding: 16,
      }}
    >
      <h2>Performance Insights</h2>
      <TracingKeyInput />
    </div>
  );
}

export default IndexPopup;
