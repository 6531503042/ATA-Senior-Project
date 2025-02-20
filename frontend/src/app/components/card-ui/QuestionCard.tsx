"use client"

import React, { useEffect, useState } from 'react'
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button
} from "@nextui-org/react";
import { Edit3, Ellipsis, Eye, HelpCircle, MessageCircle, MoreVertical, Share2, Trash2 } from 'lucide-react';

interface Post {
    id: number;
    text: string;
    questionType: string;
    category: string;
}

const QuestionCard = ({ post }: { post: Post }) => {
    const [postData, setPostData] = useState<Post[]>([]);

    const getPosts = async () => {
        try {
            const token = localStorage.getItem("access_token");
    
            const res = await fetch(
                "http://localhost:8084/api/v1/admin/questions/get-all",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    cache: "no-store",
                }
            );
    
            if (!res.ok) {
                throw new Error(`Failed to fetch data: ${res.status}`);
            }
    
            const data = await res.json();
            console.log("API Response:", data);
            setPostData(data);
        } catch (error) {
            console.error("Error loading post:", error);
        }
    };
    
    useEffect(() => {
        getPosts();
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 w-full">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h2 className="text-lg font-medium text-slate-900 line-clamp-2 mb-2">
                            {post.text}
                        </h2>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <div className="flex items-center">
                                <MessageCircle className="w-4 h-4 mr-1.5 text-blue-600" />
                                <span>0 responses</span>
                            </div>
                            <div className="flex items-center">
                                <HelpCircle className="w-4 h-4 mr-1.5 text-purple-600" />
                                <span>{post.questionType}</span>
                            </div>
                        </div>
                    </div>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button 
                                isIconOnly
                                variant="light"
                                className="p-2 hover:bg-slate-50 rounded-full"
                            >
                                <Ellipsis className="w-4 h-4 text-slate-600" />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Question actions">
                            <DropdownItem
                                key="view"
                                startContent={<Eye className="w-4 h-4" />}
                            >
                                View Details
                            </DropdownItem>
                            <DropdownItem
                                key="edit"
                                startContent={<Edit3 className="w-4 h-4" />}
                            >
                                Edit Question
                            </DropdownItem>
                            <DropdownItem
                                key="delete"
                                className="text-red-600"
                                startContent={<Trash2 className="w-4 h-4" />}
                            >
                                Delete
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        Active
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                        {post.category}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;