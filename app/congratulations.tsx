import { Link } from "react-router-dom";

export default function Congratulations() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">🎉 Congratulations!</h1>
      <p className="mb-6 text-center text-gray-700">
        You’ve completed the interview. Great job!
      </p>
      <Link
        to="/home"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go to Home
      </Link>
    </div>
  );
}
