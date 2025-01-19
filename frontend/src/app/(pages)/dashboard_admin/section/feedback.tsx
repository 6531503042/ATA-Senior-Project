"use client";

import React, { useState, useMemo } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Button,
    Input,
    Chip,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@nextui-org/react";
import { Search, Moon, Sun, ChevronDown } from "lucide-react";

const FeedbackManagement = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [teamFilter, setTeamFilter] = useState("All");
    const [projectFilter, setProjectFilter] = useState("All");
    const [sentimentFilter, setSentimentFilter] = useState("All");

    const [feedbackFormQuestions, setFeedbackFormQuestions] = useState([
        { id: 1, question: "How was the collaboration?", editable: false },
        { id: 2, question: "Was the project completed on time?", editable: false },
        { id: 3, question: "Do you have any suggestions for improvement?", editable: false },
    ]);

    const feedbackData = [
        { id: 1, team: "Frontend", project: "Website Redesign", feedback: "Great collaboration", sentiment: "Positive", status: "pending", date: "2025-01-05" },
        { id: 2, team: "Backend", project: "API Development", feedback: "Need more documentation", sentiment: "Neutral", status: "check", date: "2025-01-07" },
        { id: 3, team: "Design", project: "Mobile App", feedback: "Meeting deadlines is challenging", sentiment: "Negative", status: "pending", date: "2025-01-08" }
    ];

    const columns = [
        { key: "team", label: "TEAM" },
        { key: "project", label: "PROJECT" },
        { key: "feedback", label: "FEEDBACK" },
        { key: "sentiment", label: "SENTIMENT" },
        { key: "status", label: "STATUS" },
        { key: "date", label: "DATE" },
    ];

    const filteredData = useMemo(
        () =>
            feedbackData.filter((item) =>
                (teamFilter === "All" || item.team === teamFilter) &&
                (projectFilter === "All" || item.project === projectFilter) &&
                (sentimentFilter === "All" || item.sentiment === sentimentFilter) &&
                (!searchQuery || Object.values(item).some((value) => value.toString().toLowerCase().includes(searchQuery.toLowerCase())))
            ),
        [teamFilter, projectFilter, sentimentFilter, searchQuery]
    );

    const sentimentColors = {
        Positive: "bg-green-200 text-green-800 px-2 py-1 min-w-[100px] text-center",
        Neutral: "bg-yellow-200 text-yellow-800 px-2 py-1 min-w-[100px] text-center",
        Negative: "bg-red-200 text-red-800 px-2 py-1 min-w-[100px] text-center",
    };

    const statusColors = {
        pending: "bg-yellow-200 text-yellow-800 px-2 py-1 min-w-[100px] text-center",
        check: "bg-green-200 text-green-800 px-2 py-1 min-w-[100px] text-center",
    };

    const handleAddNewQuestion = () => {
        setFeedbackFormQuestions((prev) => [
            ...prev,
            { id: prev.length + 1, question: "", editable: true },
        ]);
    };

    const handleEditQuestion = (id) => {
        setFeedbackFormQuestions((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, editable: true } : item
            )
        );
    };

    const handleDeleteQuestion = (id) => {
        setFeedbackFormQuestions((prev) =>
            prev.filter((item) => item.id !== id)
        );
    };

    const handleQuestionChange = (id, newQuestion) => {
        setFeedbackFormQuestions((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, question: newQuestion } : item
            )
        );
    };

    return (
        <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
            <div className="w-full px-6 py-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">Feedback Management</h1>
                </div>
                <Button isIconOnly variant="light" onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? <Sun /> : <Moon />}
                </Button>
            </div>

            <main className="container mx-auto p-6 max-w-7xl">
                <div className="flex gap-4 mb-6">
                    <Input
                        type="text"
                        placeholder="Search feedback..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        startContent={<Search className="text-gray-400" />}
                        className="w-full md:w-auto"
                    />
                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant="flat">Team: {teamFilter}</Button>
                        </DropdownTrigger>
                        <DropdownMenu onAction={(key) => setTeamFilter(key as string)}>
                            <DropdownItem key="All">All</DropdownItem>
                            <DropdownItem key="Frontend">Frontend</DropdownItem>
                            <DropdownItem key="Backend">Backend</DropdownItem>
                            <DropdownItem key="Design">Design</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant="flat">Project: {projectFilter}</Button>
                        </DropdownTrigger>
                        <DropdownMenu onAction={(key) => setProjectFilter(key as string)}>
                            <DropdownItem key="All">All</DropdownItem>
                            <DropdownItem key="Website Redesign">Website Redesign</DropdownItem>
                            <DropdownItem key="API Development">API Development</DropdownItem>
                            <DropdownItem key="Mobile App">Mobile App</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant="flat">Sentiment: {sentimentFilter}</Button>
                        </DropdownTrigger>
                        <DropdownMenu onAction={(key) => setSentimentFilter(key as string)}>
                            <DropdownItem key="All">All</DropdownItem>
                            <DropdownItem key="Positive">Positive</DropdownItem>
                            <DropdownItem key="Neutral">Neutral</DropdownItem>
                            <DropdownItem key="Negative">Negative</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>

                {/* New table added here */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Feedback Table</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="min-w-full table-auto">
                            <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left">TEAM</th>
                                <th className="py-2 px-4 border-b text-left">PROJECT</th>
                                <th className="py-2 px-4 border-b text-left">FEEDBACK</th>
                                <th className="py-2 px-4 border-b text-left">SENTIMENT</th>
                                <th className="py-2 px-4 border-b text-left">STATUS</th>
                                <th className="py-2 px-4 border-b text-left">DATE</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-200">
                                    <td className="py-2 px-4 border-b">{item.team}</td>
                                    <td className="py-2 px-4 border-b">{item.project}</td>
                                    <td className="py-2 px-4 border-b">{item.feedback}</td>
                                    <td className="py-2 px-4 border-b">
                                        <Chip className={sentimentColors[item.sentiment]}>{item.sentiment}</Chip>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <Chip className={statusColors[item.status]}>{item.status}</Chip>
                                    </td>
                                    <td className="py-2 px-4 border-b">{item.date}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Feedback Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5">
                            {filteredData.map((item) => (
                                <div key={item.id} className="p-5 bg-violet-50 border border-violet-800 rounded-lg flex flex-col gap-3 hover:scale-105 transition-all duration-500">
                                    <h1 className="font-semibold">{item.feedback}</h1>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-violet-700">{item.project}</p>
                                        <Chip className={sentimentColors[item.sentiment]}>{item.sentiment}</Chip>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Chip className={statusColors[item.status]}>{item.status}</Chip>
                                        <p className="text-sm">{item.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Feedback Form Editor</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleAddNewQuestion} className="mb-4">Add New Question</Button>
                        <div className="grid gap-4">
                            {feedbackFormQuestions.map((item) => (
                                <div key={item.id} className="p-4 bg-white border border-gray-300 rounded-md flex justify-between items-center">
                                    {item.editable ? (
                                        <Input
                                            value={item.question}
                                            onChange={(e) => handleQuestionChange(item.id, e.target.value)}
                                            className="w-full"
                                        />
                                    ) : (
                                        <p className="text-gray-700">{item.question}</p>
                                    )}
                                    <div className="flex gap-2">
                                        {item.editable ? (
                                            <Button onClick={() => handleEditQuestion(item.id)}>Save</Button>
                                        ) : (
                                            <Button onClick={() => handleEditQuestion(item.id)}>Edit</Button>
                                        )}
                                        <Button onClick={() => handleDeleteQuestion(item.id)} color="error">Delete</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default FeedbackManagement;
