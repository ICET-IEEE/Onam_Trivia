"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Chapter, UserProgress, FirstSolver } from "@/lib/types";
import { Insignia } from "@/components/Insignia";

export function AdminDashboardClient({
  initialChapters,
  initialUsersProgress = [],
  initialFirstSolvers = [],
}: {
  initialChapters: Chapter[];
  initialUsersProgress?: UserProgress[];
  initialFirstSolvers?: FirstSolver[];
}) {
  const [activeTab, setActiveTab] = useState<"chapters" | "users" | "leaderboard" | "first-solvers">("chapters");
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters);
  const [usersProgress, setUsersProgress] = useState<UserProgress[]>(initialUsersProgress);
  const [selectedUser, setSelectedUser] = useState<UserProgress | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<FirstSolver | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    chapter_number: "1",
    title: "",
    description: "",
    difficulty: "Easy",
    status: "available",
    is_published: false,
  });

  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  const refreshChapters = async () => {
    const { data } = await supabase
      .from("chapters")
      .select("*")
      .order("chapter_number", { ascending: true });
    if (data) setChapters(data);
  };

  const openForm = (chapter?: Chapter) => {
    if (chapter) {
      setEditingChapter(chapter);
      setFormData({
        chapter_number: chapter.chapter_number,
        title: chapter.title,
        description: chapter.description || "",
        difficulty: chapter.difficulty || "Easy",
        status: chapter.status || "available",
        is_published: chapter.is_published,
      });
    } else {
      setEditingChapter(null);
      setFormData({
        chapter_number: String(chapters.length > 0 ? chapters.length + 1 : 1),
        title: "",
        description: "",
        difficulty: "Easy",
        status: "available",
        is_published: false,
      });
    }
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.chapter_number) {
      setError("Chapter number is required.");
      setLoading(false);
      return;
    }

    if (editingChapter) {
      const { error: updateError } = await supabase
        .from("chapters")
        .update(formData)
        .eq("id", editingChapter.id);

      if (updateError) {
        if (updateError.code === "23505") {
          setError("A chapter with this number already exists.");
        } else {
          setError(updateError.message);
        }
      } else {
        setSuccess("Chapter updated successfully.");
        setIsFormOpen(false);
        refreshChapters();
      }
    } else {
      const { error: insertError } = await supabase
        .from("chapters")
        .insert([formData]);

      if (insertError) {
        if (insertError.code === "23505") {
          setError("A chapter with this number already exists.");
        } else {
          setError(insertError.message);
        }
      } else {
        setSuccess("Chapter created successfully.");
        setIsFormOpen(false);
        refreshChapters();
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this chapter?")) {
      const { error: deleteError } = await supabase
        .from("chapters")
        .delete()
        .eq("id", id);

      if (deleteError) {
        alert("Failed to delete chapter: " + deleteError.message);
      } else {
        refreshChapters();
      }
    }
  };

  return (
    <div className="min-h-screen bg-ivory">
      <header className="bg-white border-b border-ivory-line p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Insignia className="w-8 h-8 text-gold" animated={false} />
          <div>
            <h1 className="font-display font-bold text-ink tracking-widest text-lg">MAVELI'S TRIAL</h1>
            <p className="text-xs text-ink-faint uppercase tracking-[0.2em]">Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-ink-soft hover:text-rust transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-8 sm:p-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-display font-bold text-ink">Admin Dashboard</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-ivory-line mb-8">
          <button
            onClick={() => setActiveTab("chapters")}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === "chapters"
                ? "border-kingdom-green text-kingdom-green"
                : "border-transparent text-ink-soft hover:text-ink hover:border-ivory-line"
              }`}
          >
            Chapters
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === "users"
                ? "border-kingdom-green text-kingdom-green"
                : "border-transparent text-ink-soft hover:text-ink hover:border-ivory-line"
              }`}
          >
            Users Progress
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === "leaderboard"
                ? "border-kingdom-green text-kingdom-green"
                : "border-transparent text-ink-soft hover:text-ink hover:border-ivory-line"
              }`}
          >
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab("first-solvers")}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === "first-solvers"
                ? "border-kingdom-green text-kingdom-green"
                : "border-transparent text-ink-soft hover:text-ink hover:border-ivory-line"
              }`}
          >
            First Solvers
          </button>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-kingdom-green/10 text-kingdom-green rounded-lg text-sm font-medium">
            {success}
          </div>
        )}

        {activeTab === "chapters" ? (
          <section className="bg-white rounded-xl border border-ivory-line shadow-sm overflow-hidden">
            <div className="p-6 border-b border-ivory-line flex justify-between items-center">
              <h3 className="text-xl font-display font-bold text-ink">Chapters</h3>
              <button
                onClick={() => openForm()}
                className="bg-ink hover:bg-ink-deep text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                + Add Chapter
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-ivory/50 border-b border-ivory-line text-sm font-semibold text-ink-faint">
                    <th className="p-4">Number</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Created Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {chapters.map((chapter) => (
                    <tr key={chapter.id} className="border-b border-ivory-line hover:bg-ivory/30 transition-colors">
                      <td className="p-4 font-medium text-ink">{chapter.chapter_number}</td>
                      <td className="p-4 text-ink">{chapter.title}</td>
                      <td className="p-4">
                        {chapter.is_published ? (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-kingdom-green/10 text-kingdom-green">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-ink/5 text-ink-soft">
                            Unpublished
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-ink-soft text-sm">
                        {new Date(chapter.created_at!).toLocaleDateString()}
                      </td>
                      <td className="p-4 flex justify-end gap-3">
                        <button
                          onClick={() => router.push(`/admin/chapters/${chapter.id}`)}
                          className="text-sm font-medium text-kingdom-green hover:text-kingdom-green-deep transition-colors mr-2"
                        >
                          Manage Challenges
                        </button>
                        <button
                          onClick={() => openForm(chapter)}
                          className="text-sm font-medium text-gold hover:text-gold-deep transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(chapter.id)}
                          className="text-sm font-medium text-rust hover:text-rust-deep transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {chapters.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-ink-soft">No chapters found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : activeTab === "users" ? (
          <section className="bg-white rounded-xl border border-ivory-line shadow-sm overflow-hidden">
            <div className="p-6 border-b border-ivory-line flex justify-between items-center">
              <h3 className="text-xl font-display font-bold text-ink">User Progress</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-ivory/50 border-b border-ivory-line text-sm font-semibold text-ink-faint uppercase tracking-wider">
                    <th className="p-4">Name</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Challenges Solved</th>
                    <th className="p-4">Chapters Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {usersProgress.map((user) => (
                    <tr
                      key={user.userId}
                      onClick={() => setSelectedUser(user)}
                      className="border-b border-ivory-line hover:bg-ivory/30 transition-colors cursor-pointer"
                    >
                      <td className="p-4 font-medium text-ink">{user.name}</td>
                      <td className="p-4 font-bold text-kingdom-green">{user.score} pts</td>
                      <td className="p-4 text-ink">
                        {user.challengesSolved} / {user.totalChallenges}
                      </td>
                      <td className="p-4 text-ink">
                        {user.chaptersCompleted} / {user.totalChapters}
                      </td>
                    </tr>
                  ))}
                  {usersProgress.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-ink-soft">No active users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : activeTab === "leaderboard" ? (
          <section className="bg-white rounded-xl border border-ivory-line shadow-sm overflow-hidden">
            <div className="p-6 border-b border-ivory-line flex justify-between items-center">
              <h3 className="text-xl font-display font-bold text-ink">Completion Leaderboard</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-ivory/50 border-b border-ivory-line text-sm font-semibold text-ink-faint uppercase tracking-wider">
                    <th className="p-4">Rank</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">College</th>
                    <th className="p-4">Completion Time</th>
                    <th className="p-4">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {usersProgress
                    .filter(u => u.totalChallenges > 0 && u.challengesSolved === u.totalChallenges)
                    .sort((a, b) => (a.latestSolveTime || Infinity) - (b.latestSolveTime || Infinity))
                    .map((user, index) => (
                      <tr
                        key={user.userId}
                        onClick={() => setSelectedUser(user)}
                        className="border-b border-ivory-line hover:bg-ivory/30 transition-colors cursor-pointer"
                      >
                        <td className="p-4 font-display font-bold text-kingdom-green">#{index + 1}</td>
                        <td className="p-4 font-medium text-ink">{user.name}</td>
                        <td className="p-4 text-ink">{user.collegeName || "N/A"}</td>
                        <td className="p-4 text-ink">
                          {user.latestSolveTime ? new Date(user.latestSolveTime).toLocaleString() : "N/A"}
                        </td>
                        <td className="p-4 font-bold text-kingdom-green">{user.score} pts</td>
                      </tr>
                  ))}
                  {usersProgress.filter(u => u.totalChallenges > 0 && u.challengesSolved === u.totalChallenges).length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-ink-soft">No users have completed all challenges yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-xl border border-ivory-line shadow-sm overflow-hidden">
            <div className="p-6 border-b border-ivory-line flex justify-between items-center">
              <h3 className="text-xl font-display font-bold text-ink">First Solvers</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-ivory/50 border-b border-ivory-line text-sm font-semibold text-ink-faint uppercase tracking-wider">
                    <th className="p-4">Chapter</th>
                    <th className="p-4">Challenge</th>
                  </tr>
                </thead>
                <tbody>
                  {initialFirstSolvers.map((solver) => (
                    <tr
                      key={solver.challengeId}
                      onClick={() => setSelectedChallenge(solver)}
                      className="border-b border-ivory-line hover:bg-ivory/30 transition-colors cursor-pointer"
                    >
                      <td className="p-4 font-display font-bold text-ink">Chapter {solver.chapterNumber}</td>
                      <td className="p-4 font-medium text-ink">{solver.challengeTitle}</td>
                    </tr>
                  ))}
                  {initialFirstSolvers.length === 0 && (
                    <tr>
                      <td colSpan={2} className="p-8 text-center text-ink-soft">No challenges found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-ivory-line flex justify-between items-center bg-ivory/50">
              <h2 className="text-xl font-display font-bold text-ink">
                {editingChapter ? "Edit Chapter" : "Create Chapter"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              {error && (
                <div className="p-3 bg-rust/10 text-rust rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink">Chapter Number</label>
                <input
                  type="text"
                  required
                  value={formData.chapter_number}
                  onChange={(e) => setFormData({ ...formData, chapter_number: e.target.value })}
                  className="rounded-xl border border-ivory-line bg-white px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink">Chapter Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="rounded-xl border border-ivory-line bg-white px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="rounded-xl border border-ivory-line bg-white px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="rounded-xl border border-ivory-line bg-white px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="rounded-xl border border-ivory-line bg-white px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none"
                  >
                    <option value="available">Available</option>
                    <option value="locked">Locked</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-5 h-5 accent-kingdom-green"
                />
                <label htmlFor="published" className="text-sm font-medium text-ink cursor-pointer">
                  Published
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-ivory-line">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2.5 rounded-full font-medium text-ink-soft hover:bg-ink/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gold hover:bg-gold-deep text-white px-6 py-2.5 rounded-full font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : (editingChapter ? "Update Chapter" : "Create Chapter")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-ivory-line flex justify-between items-center bg-ivory/50">
              <h2 className="text-xl font-display font-bold text-ink">User Details</h2>
              <button onClick={() => setSelectedUser(null)} className="text-ink-soft hover:text-ink">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-ink-faint uppercase font-bold tracking-wider mb-1">Name</span>
                <span className="font-medium text-ink">{selectedUser.name}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-ink-faint uppercase font-bold tracking-wider mb-1">Mobile Number</span>
                <span className="font-medium text-ink">{selectedUser.mobileNumber || "N/A"}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-ink-faint uppercase font-bold tracking-wider mb-1">Email</span>
                <span className="font-medium text-ink">{selectedUser.email || "N/A"}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-ink-faint uppercase font-bold tracking-wider mb-1">College</span>
                <span className="font-medium text-ink">{selectedUser.collegeName || "N/A"}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-ink-faint uppercase font-bold tracking-wider mb-1">Registered At</span>
                <span className="font-medium text-ink">
                  {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "N/A"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-ivory/50 p-4 rounded-xl border border-ivory-line">
                  <span className="text-xs text-ink-faint uppercase font-bold tracking-wider block mb-1">Score</span>
                  <span className="text-xl font-display text-kingdom-green font-bold">{selectedUser.score}</span>
                </div>
                <div className="bg-ivory/50 p-4 rounded-xl border border-ivory-line">
                  <span className="text-xs text-ink-faint uppercase font-bold tracking-wider block mb-1">Solved</span>
                  <span className="text-xl font-display text-ink font-bold">{selectedUser.challengesSolved} / {selectedUser.totalChallenges}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-ivory-line flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-ink hover:bg-ink-deep text-white px-6 py-2.5 rounded-full font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Challenge Solvers Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-ivory-line flex justify-between items-center bg-ivory/50">
              <h2 className="text-xl font-display font-bold text-ink">
                Solvers: {selectedChallenge.challengeTitle}
              </h2>
              <button onClick={() => setSelectedChallenge(null)} className="text-ink-soft hover:text-ink">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-ivory/50 border-b border-ivory-line text-sm font-semibold text-ink-faint uppercase tracking-wider">
                    <th className="p-4">Rank</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">College</th>
                    <th className="p-4">Solved At</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedChallenge.solvers.map((solver, index) => (
                    <tr key={index} className="border-b border-ivory-line hover:bg-ivory/30 transition-colors">
                      <td className="p-4 font-display font-bold text-kingdom-green">#{index + 1}</td>
                      <td className="p-4 font-medium text-ink">{solver.userName}</td>
                      <td className="p-4 text-ink">{solver.collegeName || "N/A"}</td>
                      <td className="p-4 text-ink">{new Date(solver.solvedAt).toLocaleString('en-GB')}</td>
                    </tr>
                  ))}
                  {selectedChallenge.solvers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-ink-soft">No one has solved this challenge yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-ivory-line flex justify-end bg-white">
              <button
                onClick={() => setSelectedChallenge(null)}
                className="bg-ink hover:bg-ink-deep text-white px-6 py-2.5 rounded-full font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
