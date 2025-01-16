"use client";

import { Input } from "@nextui-org/react"; // Next UI Input component

const SearchBar = () => {
    return (
        <div className="mb-4">
            <Input
                label="Search Feedback"
                placeholder="Search by team, project, or content..."
                className="w-full"
            />
        </div>
    );
};

export default SearchBar;
