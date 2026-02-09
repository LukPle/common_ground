'use client';

interface AddDetailsStepProps {
  title: string;
  setTitle: (v: string) => void;
  submissionDescription: string;
  setSubmissionDescription: (v: string) => void;
}

export function AddDetailsStep({
  title,
  setTitle,
  submissionDescription,
  setSubmissionDescription,
}: AddDetailsStepProps) {
  return (
    <form className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Idea Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., 'Eco-Friendly Playground & Solar Hub'"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="submissionDescription"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description
        </label>
        <textarea
          id="submissionDescription"
          value={submissionDescription}
          onChange={(e) => setSubmissionDescription(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          rows={4}
          required
        />
      </div>
    </form>
  );
}
