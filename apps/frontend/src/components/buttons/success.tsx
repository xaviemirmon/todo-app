export const SuccessButton = ({ disabled }: { disabled: boolean }) => {
  return (
    <button
      type="submit"
      className="border border-gray-300 text-black px-4 py-2 rounded text-sm hover:bg-green-500 hover:text-white"
      disabled={disabled}
    >
      Add Todo
    </button>
  );
};
