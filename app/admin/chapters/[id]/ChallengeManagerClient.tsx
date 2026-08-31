"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Chapter, Challenge, ChallengeAnswer } from "@/lib/types";
import { Insignia } from "@/components/Insignia";
import { hashFlag } from "@/lib/crypto";
import { normalizeAnswer } from "@/lib/normalization";

export function ChallengeManagerClient({ 
  chapter, 
  initialChallenges 
}: { 
  chapter: Chapter, 
  initialChallenges: Challenge[] 
}) {
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    order_number: 1,
    title: "",
    description: "",
    question: "",
    type: "photo_song",
    difficulty: "easy",
    points: 100,
    hint: "",
    is_published: false,
    answers: [""] as string[], // Array of accepted answers
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const router = useRouter();

  const refreshChallenges = async () => {
    const { data } = await supabase
      .from("challenges")
      .select("*")
      .eq("chapter_id", chapter.id)
      .order("order_number", { ascending: true });
    if (data) setChallenges(data);
  };

  const openForm = async (challenge?: Challenge) => {
    setImageFile(null);
    setAudioFile(null);
    setVideoFile(null);
    if (challenge) {
      setEditingChallenge(challenge);
      
      // Fetch existing answers for this challenge
      const { data: answers } = await supabase
        .from('challenge_answers')
        .select('answer_hash')
        .eq('challenge_id', challenge.id);
      
      setFormData({
        order_number: challenge.order_number,
        title: challenge.title,
        description: challenge.description || "",
        question: challenge.question || "",
        type: challenge.type,
        difficulty: challenge.difficulty,
        points: challenge.points,
        hint: challenge.hint || "",
        is_published: challenge.is_published,
        answers: [""] as string[], // Start with empty array for editing
      });
      setImagePreview(challenge.image_url || null);
      setAudioPreview(challenge.audio_url || null);
      setVideoPreview(challenge.video_url || null);
    } else {
      setEditingChallenge(null);
      setFormData({
        order_number: challenges.length > 0 ? Math.max(...challenges.map(c => c.order_number)) + 1 : 1,
        title: "",
        description: "",
        question: "",
        type: "photo_song",
        difficulty: "easy",
        points: 100,
        hint: "",
        is_published: false,
        answers: [""], // Start with one empty answer
      });
      setImagePreview(null);
      setAudioPreview(null);
      setVideoPreview(null);
    }
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      setAudioPreview(file.name);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setVideoPreview(file.name);
    }
  };

  const addAnswerField = () => {
    setFormData({...formData, answers: [...formData.answers, ""]});
  };

  const removeAnswerField = (index: number) => {
    if (formData.answers.length > 1) {
      const newAnswers = formData.answers.filter((_, i) => i !== index);
      setFormData({...formData, answers: newAnswers});
    }
  };

  const updateAnswer = (index: number, value: string) => {
    const newAnswers = [...formData.answers];
    newAnswers[index] = value;
    setFormData({...formData, answers: newAnswers});
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return editingChallenge?.image_url || null;
    
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${chapter.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('challenge-assets')
      .upload(filePath, imageFile);

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from('challenge-assets')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const uploadAudio = async (): Promise<string | null> => {
    if (!audioFile) return editingChallenge?.audio_url || null;
    
    const fileExt = audioFile.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${chapter.id}/audio/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('challenge-assets')
      .upload(filePath, audioFile);

    if (uploadError) {
      throw new Error(`Audio upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from('challenge-assets')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const uploadVideo = async (): Promise<string | null> => {
    if (!videoFile) return editingChallenge?.video_url || null;
    
    // If there is an existing video, we should attempt to delete it first,
    // or just let it be orphaned for now (or implement delete on success).
    
    const fileExt = videoFile.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `videos/${chapter.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('challenge-videos')
      .upload(filePath, videoFile);

    if (uploadError) {
      throw new Error(`Video upload failed: ${uploadError.message}`);
    }

    // If editing and replacing, try to remove the old video from storage
    if (editingChallenge && editingChallenge.video_url) {
      const oldPath = editingChallenge.video_url;
      // Fire and forget deletion of old video
      supabase.storage.from('challenge-videos').remove([oldPath]);
    }

    // Return the raw path, not a signed/public URL
    return filePath;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.order_number < 1) {
      setError("Order number must be a positive integer.");
      setLoading(false);
      return;
    }
    
    // Validate that at least one answer is provided
    const validAnswers = formData.answers.filter(answer => answer.trim() !== "");
    if (!editingChallenge && validAnswers.length === 0) {
      setError("At least one accepted answer is required for new challenges.");
      setLoading(false);
      return;
    }

    try {
      let imageUrl = null;
      let audioUrl = null;
      let videoUrl = null;
      
      try {
        imageUrl = await uploadImage();
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
        return;
      }

      try {
        audioUrl = await uploadAudio();
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
        return;
      }

      try {
        videoUrl = await uploadVideo();
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
        return;
      }

      // Clear fields based on type to prevent orphaned data
      let finalImageUrl: string | null = imageUrl;
      let finalAudioUrl: string | null = audioUrl;
      let finalVideoUrl: string | null = videoUrl;
      let finalQuestion: string | null = formData.question;

      if (formData.type === "photo_only") {
        finalAudioUrl = null;
        finalVideoUrl = null;
        finalQuestion = null;
      } else if (formData.type === "question_answer") {
        finalImageUrl = null;
        finalAudioUrl = null;
        finalVideoUrl = null;
      } else if (formData.type === "photo_song") {
        finalVideoUrl = null;
        finalQuestion = null;
      } else if (formData.type === "video") {
        finalImageUrl = null;
        finalAudioUrl = null;
        finalQuestion = null;
      }

      const payload = {
        chapter_id: chapter.id,
        title: formData.title,
        description: formData.description,
        question: finalQuestion,
        type: formData.type,
        difficulty: formData.difficulty,
        points: formData.points,
        hint: formData.hint,
        is_published: formData.is_published,
        order_number: formData.order_number,
        image_url: finalImageUrl,
        audio_url: finalAudioUrl,
        video_url: finalVideoUrl,
      };

      let challengeId: string;

      if (editingChallenge) {
        const { error: updateError } = await supabase
          .from("challenges")
          .update(payload)
          .eq("id", editingChallenge.id);

        if (updateError) {
          if (updateError.code === "23505") {
            throw new Error("A challenge with this order number already exists in this chapter.");
          } else {
            throw new Error(updateError.message);
          }
        }
        challengeId = editingChallenge.id;
        setSuccess("Challenge updated successfully.");
      } else {
        const { data: newChallenge, error: insertError } = await supabase
          .from("challenges")
          .insert([payload])
          .select()
          .single();

        if (insertError) {
          if (insertError.code === "23505") {
            throw new Error("A challenge with this order number already exists in this chapter.");
          } else {
            throw new Error(insertError.message);
          }
        }
        challengeId = newChallenge.id;
        setSuccess("Challenge created successfully.");
      }

      // Save multiple accepted answers (only delete/replace if new valid answers are entered when editing)
      if (validAnswers.length > 0) {
        if (editingChallenge) {
          await supabase
            .from('challenge_answers')
            .delete()
            .eq('challenge_id', challengeId);
        }

        const answerHashes = await Promise.all(
          validAnswers.map(async (answer) => {
            return await hashFlag(answer);
          })
        );

        const answersPayload = answerHashes.map(hash => ({
          challenge_id: challengeId,
          answer_hash: hash
        }));

        const { error: answersError } = await supabase
          .from('challenge_answers')
          .insert(answersPayload);

        if (answersError) {
          throw new Error(`Failed to save answers: ${answersError.message}`);
        }
      }
      
      setIsFormOpen(false);
      refreshChallenges();
    } catch (err: any) {
      setError(err.message);
    }
    
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this challenge?")) {
      const { error: deleteError } = await supabase
        .from("challenges")
        .delete()
        .eq("id", id);
        
      if (deleteError) {
        alert("Failed to delete challenge: " + deleteError.message);
      } else {
        refreshChallenges();
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
            <p className="text-xs text-ink-faint uppercase tracking-[0.2em]">Admin / Chapter Challenges</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => router.push("/admin/dashboard")}
            className="text-sm font-medium text-ink-soft hover:text-ink transition-colors"
          >
            &larr; Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8 sm:p-12">
        <div className="mb-10">
          <span className="text-sm font-bold tracking-[0.2em] text-rust uppercase">
            Chapter {chapter.chapter_number}
          </span>
          <h2 className="text-3xl font-display font-bold text-ink mt-2">{chapter.title}</h2>
          <p className="text-ink-soft mt-2">{chapter.description}</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-kingdom-green/10 text-kingdom-green rounded-lg text-sm font-medium">
            {success}
          </div>
        )}

        <section className="bg-white rounded-xl border border-ivory-line shadow-sm overflow-hidden">
          <div className="p-6 border-b border-ivory-line flex justify-between items-center">
            <h3 className="text-xl font-display font-bold text-ink">Challenges</h3>
            <button 
              onClick={() => openForm()}
              className="bg-ink hover:bg-ink-deep text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Add Challenge
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ivory/50 border-b border-ivory-line text-sm font-semibold text-ink-faint">
                  <th className="p-4">No.</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Difficulty</th>
                  <th className="p-4">Points</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {challenges.map((chal) => (
                  <tr key={chal.id} className="border-b border-ivory-line hover:bg-ivory/30 transition-colors">
                    <td className="p-4 font-medium text-ink">{String(chal.order_number).padStart(2, '0')}</td>
                    <td className="p-4 text-ink font-medium">{chal.title}</td>
                    <td className="p-4 text-ink-soft capitalize">
                      {chal.type === 'photo_song' ? 'Photo + Song' : 
                       chal.type === 'photo_only' ? 'Photo Only' : 
                       chal.type === 'video' ? 'Video' : 
                       chal.type === 'question_answer' ? 'Question & Answer' : 
                       chal.type.replace('_', ' ')}
                    </td>
                    <td className="p-4 text-ink-soft capitalize">{chal.difficulty}</td>
                    <td className="p-4 text-kingdom-green font-semibold">{chal.points}</td>
                    <td className="p-4">
                      {chal.is_published ? (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-kingdom-green/10 text-kingdom-green">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-ink/5 text-ink-soft">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 flex justify-end gap-3">
                      <button 
                        onClick={() => openForm(chal)} 
                        className="text-sm font-medium text-gold hover:text-gold-deep transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(chal.id)} 
                        className="text-sm font-medium text-rust hover:text-rust-deep transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {challenges.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-ink-soft">No challenges found in this chapter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col my-8">
            <div className="p-6 border-b border-ivory-line flex justify-between items-center bg-ivory/50">
              <h2 className="text-xl font-display font-bold text-ink">
                {editingChallenge ? "Edit Challenge" : "Create Challenge"}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
              {error && (
                <div className="p-3 bg-rust/10 text-rust rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">Challenge Number (Order)</label>
                  <input 
                    type="number" 
                    min="1" 
                    required 
                    value={formData.order_number} 
                    onChange={(e) => setFormData({...formData, order_number: parseInt(e.target.value)})}
                    className="rounded-xl border border-ivory-line bg-white px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">Points</label>
                  <input 
                    type="number" 
                    min="0"
                    required 
                    value={formData.points} 
                    onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
                    className="rounded-xl border border-ivory-line bg-white px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink">Title</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="rounded-xl border border-ivory-line bg-white px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink">Description (Optional)</label>
                <textarea 
                  rows={2}
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="rounded-xl border border-ivory-line bg-white px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none resize-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">Challenge Type</label>
                  <select 
                    value={formData.type} 
                    onChange={(e) => {
                      const newType = e.target.value;
                      // Clear question when switching away from question_answer type
                      const clearedQuestion = newType === "question_answer" ? formData.question : "";
                      setFormData({...formData, type: newType, question: clearedQuestion});
                      // Clear type-specific files when switching types
                      setImageFile(null);
                      setImagePreview(null);
                      setAudioFile(null);
                      setAudioPreview(null);
                      setVideoFile(null);
                      setVideoPreview(null);
                    }}
                    className="rounded-xl border border-ivory-line bg-white px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none" 
                  >
                    <option value="photo_song">Photo + Song</option>
                    <option value="photo_only">Photo Only</option>
                    <option value="video">Video</option>
                    <option value="question_answer">Question & Answer</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">Difficulty</label>
                  <select 
                    value={formData.difficulty} 
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                    className="rounded-xl border border-ivory-line bg-white px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none" 
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Type-specific fields */}
              {formData.type === "photo_song" && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-ink">Challenge Image</label>
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/webp"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-ink/5 hover:bg-ink/10 text-ink rounded-lg text-sm font-medium transition-colors"
                      >
                        Choose Image
                      </button>
                      <span className="text-xs text-ink-soft">
                        {imageFile ? imageFile.name : (imagePreview ? "Image attached" : "No image selected")}
                      </span>
                    </div>
                    {imagePreview && (
                      <div className="mt-2 relative w-32 h-32 rounded-lg overflow-hidden border border-ivory-line">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-ink">Audio File (MP3)</label>
                    <input 
                      type="file" 
                      accept="audio/mpeg, audio/mp3"
                      ref={audioInputRef}
                      onChange={handleAudioChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => audioInputRef.current?.click()}
                        className="px-4 py-2 bg-ink/5 hover:bg-ink/10 text-ink rounded-lg text-sm font-medium transition-colors"
                      >
                        Choose Audio
                      </button>
                      <span className="text-xs text-ink-soft">
                        {audioFile ? audioFile.name : (audioPreview ? "Audio attached" : "No audio selected")}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {formData.type === "photo_only" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">Challenge Image</label>
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/webp"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-ink/5 hover:bg-ink/10 text-ink rounded-lg text-sm font-medium transition-colors"
                    >
                      Choose Image
                    </button>
                    <span className="text-xs text-ink-soft">
                      {imageFile ? imageFile.name : (imagePreview ? "Image attached" : "No image selected")}
                    </span>
                  </div>
                  {imagePreview && (
                    <div className="mt-2 relative w-32 h-32 rounded-lg overflow-hidden border border-ivory-line">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}

              {formData.type === "question_answer" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">Question</label>
                  <textarea 
                    rows={3}
                    required
                    value={formData.question} 
                    onChange={(e) => setFormData({...formData, question: e.target.value})}
                    className="rounded-xl border border-ivory-line bg-white px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none resize-none" 
                  />
                </div>
              )}

              {formData.type === "video" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">Challenge Video (MP4, WebM, MOV)</label>
                  <input 
                    type="file" 
                    accept="video/mp4, video/webm, video/quicktime"
                    ref={videoInputRef}
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="px-4 py-2 bg-ink/5 hover:bg-ink/10 text-ink rounded-lg text-sm font-medium transition-colors"
                    >
                      Choose Video
                    </button>
                    <span className="text-xs text-ink-soft">
                      {videoFile ? videoFile.name : (videoPreview ? "Video attached" : "No video selected")}
                    </span>
                  </div>
                  {videoPreview && !videoFile && (
                    <div className="mt-2 text-xs text-kingdom-green font-medium">
                      Current video path: {videoPreview}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink">Hint (Optional)</label>
                <input 
                  type="text" 
                  value={formData.hint} 
                  onChange={(e) => setFormData({...formData, hint: e.target.value})}
                  className="rounded-xl border border-ivory-line bg-white px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none" 
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-ink flex items-center justify-between">
                  <span>Accepted Answers / Flags</span>
                  <span className="text-xs text-ink-soft">Add multiple accepted spellings (e.g., "Vamana", "Vaamana")</span>
                </label>
                <div className="space-y-2">
                  {formData.answers.map((answer, index) => (
                    <div key={index} className="flex gap-2">
                      <input 
                        type="text" 
                        value={answer} 
                        onChange={(e) => updateAnswer(index, e.target.value)}
                        placeholder={`Accepted answer ${index + 1}`}
                        className="flex-1 rounded-xl border border-ivory-line bg-white px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none" 
                      />
                      {formData.answers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAnswerField(index)}
                          className="px-3 py-2 bg-rust/10 hover:bg-rust/20 text-rust rounded-lg text-sm font-medium transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addAnswerField}
                  className="text-sm font-medium text-kingdom-green hover:text-kingdom-green-deep transition-colors flex items-center gap-1"
                >
                  + Add another accepted answer
                </button>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <input 
                  type="checkbox" 
                  id="published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                  className="w-5 h-5 accent-kingdom-green cursor-pointer"
                />
                <label htmlFor="published" className="text-sm font-medium text-ink cursor-pointer">
                  Published (Visible to players)
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
                  {loading ? "Saving..." : (editingChallenge ? "Update Challenge" : "Create Challenge")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
