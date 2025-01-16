import FeedbackTable from "@/components/FeedbackTable";
import FormEditor from "@/components/FormEditor";
import SearchBar from "@/components/SearchBar";
import "@/app/globals.css";

export default function FeedbackPage() {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Feedback Management</h1>
            <SearchBar />
            <FeedbackTable />
            <FormEditor />
        </div>
    );
}
