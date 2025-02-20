"use client";

import {
  Ellipsis,
  Eye,
  Filter,
  MessageCircle,
  Pencil,
  Search,
  Tag,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import QuestionAll from "@/app/components/card-ui/QuestionCard";

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

  return (
    <div className="w-ful py-8">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative w-[500px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-5 text-sm py-2 w-full border border-black border-opacity-10 shadow-sm bg-white rounded-lg outline-none focus:ring-[0.5px] focus:ring-zinc-200"
          />
        </div>
        <div className="flex gap-2">
          <select
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
              {categories.map((category) => (
                <option key={category} value={category} className="w-full">
                  {category}
                </option>
              ))}
          </select>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50">
            <Filter className="w-5 h-5 text-slate-600" />
          </button>
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
