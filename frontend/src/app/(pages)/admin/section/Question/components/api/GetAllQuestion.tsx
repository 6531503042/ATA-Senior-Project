"use client";

import { Search, Tag, ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import QuestionAll from "@/components/shared/QuestionListCard";
import SelectWithIcons from "@/components/shared/SelectWithIcon";

interface Post {
  id: number;
  text: string;
  questionType: string;
  category: string;
}

const GetAllQuestion = () => {
  const [postData, setPostData] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const filteredQuestions = postData.filter((question) => {
    const matchesSearch = question.text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || question.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...new Set(postData.map((post) => post.category))];
  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
    icon: Tag,
  }));

  return (
    <div className="w-full py-8">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search Box */}
        <div className="relative w-[500px]">
          <Search className="absolute left-3 top-[10px] text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-5 text-sm py-2 w-full border border-black border-opacity-10 shadow-sm bg-white rounded-lg outline-none focus:ring-[0.5px] focus:ring-zinc-200"
          />
        </div>

        {/* Styled Dropdown */}
        <div className="w-64 shadow-sm">
          <SelectWithIcons
            options={categoryOptions}
            value={selectedCategory}
            title="Select Category"
            onChange={setSelectedCategory}
          />
        </div>
      </div>

      {/* Question List */}
      {filteredQuestions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuestions.map((post) => (
            <QuestionAll key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <Tag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">
            No questions found
          </h3>
          <p className="text-sm text-slate-500">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default GetAllQuestion;
