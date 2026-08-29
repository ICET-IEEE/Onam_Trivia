"use client";

import {
  useEffect,
  useRef,
  useState,
  useMemo,
  KeyboardEvent,
} from "react";

import { createClient } from "@/lib/supabase/client";

interface CollegeComboboxProps {
  value: string;
  collegeId: string | null;
  onChange: (
    name: string,
    id: string | null
  ) => void;
}

interface CollegeSuggestion {
  id: string;
  name: string;
  is_verified: boolean;
}

export function CollegeCombobox({
  value,
  collegeId,
  onChange,
}: CollegeComboboxProps) {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [isOpen, setIsOpen] =
    useState(false);

  const [inputValue, setInputValue] =
    useState(value);

  const [suggestions, setSuggestions] =
    useState<CollegeSuggestion[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [highlightedIndex, setHighlightedIndex] =
    useState(-1);

  const containerRef =
    useRef<HTMLDivElement>(null);

  // ==========================================================
  // Sync parent value
  // ==========================================================

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // ==========================================================
  // Close dropdown when clicking outside
  // ==========================================================

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ==========================================================
  // Search colleges
  // ==========================================================

  useEffect(() => {
    if (!isOpen) {
      setSuggestions([]);
      setHighlightedIndex(-1);
      return;
    }

    const search = inputValue.trim();

    if (search.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      setHighlightedIndex(-1);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);

      try {
        const {
          data,
          error,
        } = await supabase
          .from("colleges")
          .select(
            "id, name, is_verified"
          )
          .ilike(
            "name",
            `%${search}%`
          )
          .order("name", {
            ascending: true,
          })
          .limit(10);

        if (error) {
          console.error(
            "COLLEGE SEARCH ERROR:",
            error
          );

          setSuggestions([]);
          return;
        }

        setSuggestions(
          data ?? []
        );

        setHighlightedIndex(-1);
      } catch (error) {
        console.error(
          "COLLEGE SEARCH EXCEPTION:",
          error
        );

        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [
    inputValue,
    isOpen,
    supabase,
  ]);

  // ==========================================================
  // Select existing college
  // ==========================================================

  const handleSelect = (
    college: CollegeSuggestion
  ) => {
    setInputValue(college.name);

    onChange(
      college.name,
      college.id
    );

    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // ==========================================================
  // Add a new college
  //
  // IMPORTANT:
  // We DO NOT insert into Supabase here.
  //
  // The user is not authenticated yet.
  //
  // We only tell the signup page:
  //
  // name = "ABC College"
  // id   = "NEW_COLLEGE"
  //
  // The signup page will create the college AFTER
  // authentication succeeds.
  // ==========================================================

  const handleAddNew = () => {
    const rawName =
      inputValue.trim();

    if (!rawName) {
      return;
    }

    setInputValue(rawName);

    onChange(
      rawName,
      "NEW_COLLEGE"
    );

    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // ==========================================================
  // Input change
  // ==========================================================

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    setInputValue(value);

    /*
     * If the user starts typing again after selecting
     * a college, the old college ID must be removed.
     */
    onChange(
      value,
      null
    );

    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  // ==========================================================
  // Keyboard navigation
  // ==========================================================

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    const search =
      inputValue.trim();

    if (!isOpen) {
      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowUp"
      ) {
        event.preventDefault();
        setIsOpen(true);
      }

      return;
    }

    const exactMatchExists =
      suggestions.some(
        (suggestion) =>
          suggestion.name
            .trim()
            .toLowerCase() ===
          search.toLowerCase()
      );

    const showAddOption =
      search.length >= 2 &&
      !exactMatchExists;

    const totalItems =
      suggestions.length +
      (showAddOption ? 1 : 0);

    // --------------------------------------------------------
    // Arrow Down
    // --------------------------------------------------------

    if (
      event.key === "ArrowDown"
    ) {
      event.preventDefault();

      if (totalItems === 0) {
        return;
      }

      setHighlightedIndex(
        (previous) =>
          previous <
          totalItems - 1
            ? previous + 1
            : 0
      );

      return;
    }

    // --------------------------------------------------------
    // Arrow Up
    // --------------------------------------------------------

    if (
      event.key === "ArrowUp"
    ) {
      event.preventDefault();

      if (totalItems === 0) {
        return;
      }

      setHighlightedIndex(
        (previous) =>
          previous > 0
            ? previous - 1
            : totalItems - 1
      );

      return;
    }

    // --------------------------------------------------------
    // Enter
    // --------------------------------------------------------

    if (
      event.key === "Enter"
    ) {
      event.preventDefault();

      if (
        highlightedIndex >= 0 &&
        highlightedIndex <
          suggestions.length
      ) {
        handleSelect(
          suggestions[
            highlightedIndex
          ]
        );

        return;
      }

      if (
        showAddOption &&
        highlightedIndex ===
          suggestions.length
      ) {
        handleAddNew();
        return;
      }

      /*
       * If nothing is highlighted but there is exactly
       * one suggestion, Enter selects it.
       */
      if (
        highlightedIndex === -1 &&
        suggestions.length === 1
      ) {
        handleSelect(
          suggestions[0]
        );

        return;
      }
    }

    // --------------------------------------------------------
    // Escape
    // --------------------------------------------------------

    if (
      event.key === "Escape"
    ) {
      event.preventDefault();

      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  // ==========================================================
  // Exact match
  // ==========================================================

  const exactMatchExists =
    suggestions.some(
      (suggestion) =>
        suggestion.name
          .trim()
          .toLowerCase() ===
        inputValue
          .trim()
          .toLowerCase()
    );

  const showAddOption =
    inputValue.trim().length >= 2 &&
    !exactMatchExists;

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-1.5"
    >
      <label
        htmlFor="college"
        className="text-sm font-medium text-ink"
      >
        College
      </label>

      <div className="relative">
        {/* Input */}
        <input
          id="college"
          type="text"
          value={inputValue}
          placeholder="Type your college..."
          autoComplete="off"
          onChange={handleChange}
          onFocus={() => {
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full rounded-xl border border-ivory-line bg-white px-4 py-3 pr-10 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-gold focus:outline-none"
        />

        {/* Right icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-ink-faint text-xs">
          {isLoading ? (
            <span className="inline-block animate-spin">
              ⟳
            </span>
          ) : (
            "▼"
          )}
        </div>

        {/* Dropdown */}
        {isOpen &&
          inputValue.trim().length >= 2 && (
            <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-ivory-line bg-white shadow-lg">
              <div className="max-h-60 overflow-y-auto py-1">
                {/* Loading */}
                {isLoading && (
                  <div className="px-4 py-3 text-sm text-ink-faint">
                    Searching colleges...
                  </div>
                )}

                {/* Suggestions */}
                {!isLoading &&
                  suggestions.map(
                    (
                      suggestion,
                      index
                    ) => (
                      <button
                        key={
                          suggestion.id
                        }
                        type="button"
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                          highlightedIndex ===
                          index
                            ? "bg-kingdom-green-pale text-kingdom-green"
                            : "text-ink hover:bg-ivory hover:text-kingdom-green"
                        }`}
                        onMouseDown={(
                          event
                        ) => {
                          /*
                           * Prevent the input from losing focus
                           * before selection happens.
                           */
                          event.preventDefault();

                          handleSelect(
                            suggestion
                          );
                        }}
                        onMouseEnter={() =>
                          setHighlightedIndex(
                            index
                          )
                        }
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="min-w-0">
                            {suggestion.name}
                          </span>

                          {suggestion.is_verified ? (
                            <span className="shrink-0 text-xs text-kingdom-green">
                              ✓
                            </span>
                          ) : (
                            <span className="shrink-0 text-xs italic text-ink-faint">
                              Pending
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  )}

                {/* No results */}
                {!isLoading &&
                  suggestions.length ===
                    0 && (
                    <div className="px-4 py-3 text-sm text-ink-faint">
                      No college found.
                    </div>
                  )}

                {/* Add new */}
                {!isLoading &&
                  showAddOption && (
                    <button
                      type="button"
                      className={`w-full border-t border-ivory-line px-4 py-3 text-left text-sm transition-colors ${
                        highlightedIndex ===
                        suggestions.length
                          ? "bg-kingdom-green-pale text-kingdom-green"
                          : "text-ink hover:bg-ivory hover:text-kingdom-green"
                      }`}
                      onMouseDown={(
                        event
                      ) => {
                        event.preventDefault();

                        handleAddNew();
                      }}
                      onMouseEnter={() =>
                        setHighlightedIndex(
                          suggestions.length
                        )
                      }
                    >
                      <span className="font-medium text-kingdom-green">
                        + Add &quot;
                        {inputValue.trim()}
                        &quot;
                      </span>
                    </button>
                  )}
              </div>
            </div>
          )}
      </div>

      {/* New college indicator */}
      {collegeId ===
        "NEW_COLLEGE" &&
        collegeNameIsValid(inputValue) && (
          <p className="text-xs text-ink-faint">
            This college will be added after
            you create your account.
          </p>
        )}
    </div>
  );
}

// ============================================================
// Small helper
// ============================================================

function collegeNameIsValid(
  value: string
): boolean {
  return value.trim().length >= 2;
}