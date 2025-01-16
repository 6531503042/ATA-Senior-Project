"use client";

import { Input, Button } from "@nextui-org/react"; // Next UI components
import Textarea from './Textarea';

const FormEditor = () => {
    return (
        <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Edit Feedback Form</h2>
            <form className="space-y-4">
                <Input label="Category Name" placeholder="Add a new category..." />
                <Textarea value="" onChange={() => {}} placeholder="Enter question text..." />
                <div className="flex space-x-2">
                    <Button variant="solid">Save</Button>
                    <Button variant="bordered">Reset</Button>
                </div>
            </form>
        </div>
    );
};

export default FormEditor;
