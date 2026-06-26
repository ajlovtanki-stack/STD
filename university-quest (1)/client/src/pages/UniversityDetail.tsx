/**
 * University Detail/Edit Page
 * Displays and allows editing of a single university
 */

import { useState, useEffect } from "react";
import { University } from "@/lib/types";
import { useUniversityContext } from "@/contexts/UniversityContext";
import { TierBadge } from "@/components/TierBadge";
import { ScoreRing } from "@/components/ScoreRing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Trash2, Save } from "lucide-react";

interface UniversityDetailProps {
  universityId?: string;
  onBack?: () => void;
}

export default function UniversityDetail({ universityId, onBack }: UniversityDetailProps) {
  const { universities, updateUniversity, deleteUniversity, addUniversity } = useUniversityContext();
  const [formData, setFormData] = useState<Partial<University> | null>(null);
  const [isEditing, setIsEditing] = useState(!universityId);
  const [tagInput, setTagInput] = useState("");

  const university = universityId ? universities.find((u) => u.id === universityId) : null;

  useEffect(() => {
    if (university) {
      setFormData(university);
    } else {
      setFormData({
        name: "",
        country: "",
        city: "",
        program: "",
        notes: "",
        scholarships: 50,
        employability: 50,
        language: 50,
        acceptanceRate: 50,
        cost: 50,
        careerOpportunities: 50,
        tags: [],
        status: "researching",
      });
    }
  }, [university, universityId]);

  if (!formData) return null;

  const handleSave = () => {
    if (!formData.name) return;

    if (universityId) {
      updateUniversity(universityId, formData);
    } else {
      addUniversity(formData as Omit<University, "id" | "createdAt" | "updatedAt">);
    }
    setIsEditing(false);
    onBack?.();
  };

  const handleDelete = () => {
    if (universityId && confirm("Delete this university?")) {
      deleteUniversity(universityId);
      onBack?.();
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && formData.tags) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (formData.tags) {
      setFormData({
        ...formData,
        tags: formData.tags.filter((t) => t !== tag),
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="ghost" size="sm">
              <ArrowLeft size={16} />
            </Button>
            <h1 className="font-display font-bold text-2xl">
              {universityId ? "Edit University" : "Add University"}
            </h1>
          </div>
          <div className="flex gap-2">
            {isEditing && (
              <>
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                  Cancel
                </Button>
                <Button onClick={handleSave} size="sm" className="gap-2">
                  <Save size={16} />
                  Save
                </Button>
              </>
            )}
            {!isEditing && universityId && (
              <>
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  Edit
                </Button>
                <Button onClick={handleDelete} variant="destructive" size="sm" className="gap-2">
                  <Trash2 size={16} />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Basic Info */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="font-display font-bold text-lg">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">University Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="program">Program</Label>
                <Input
                  id="program"
                  value={formData.program || ""}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country || ""}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city || ""}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                disabled={!isEditing}
                className="mt-1"
                rows={4}
              />
            </div>
          </div>

          {/* Status & Deadline */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="font-display font-bold text-lg">Application Status</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || "researching"}
                  onOpenChange={(open) => !open && setIsEditing(false)}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="status" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="researching">Researching</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="wishlist">Wishlist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.applicationDeadline?.split("T")[0] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      applicationDeadline: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                    })
                  }
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Scoring Factors */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h2 className="font-display font-bold text-lg">Scoring Factors (0-100)</h2>

            {[
              { key: "scholarships", label: "Scholarships" },
              { key: "employability", label: "Employability" },
              { key: "language", label: "Language Support" },
              { key: "acceptanceRate", label: "Acceptance Rate" },
              { key: "cost", label: "Cost (Higher = Cheaper)" },
              { key: "careerOpportunities", label: "Career Opportunities" },
            ].map(({ key, label }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <Label>{label}</Label>
                  <span className="font-display font-bold text-accent">
                    {(formData[key as keyof University] as number) || 50}
                  </span>
                </div>
                <Slider
                  value={[(formData[key as keyof University] as number) || 50]}
                  onValueChange={(value) =>
                    setFormData({ ...formData, [key]: value[0] })
                  }
                  disabled={!isEditing}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="font-display font-bold text-lg">Tags</h2>

            {isEditing && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag (e.g., Scholarship, Cheap)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                />
                <Button onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-2">
                  #{tag}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Score Preview */}
          {university && (
            <div className="bg-card border-2 border-accent rounded-lg p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-mono-regular mb-2">OVERALL SCORE</p>
                <p className="font-display font-bold text-2xl">{university.overallScore}</p>
              </div>
              <div className="flex items-center gap-6">
                <TierBadge tier={university.tier} size="lg" showLabel={true} />
                <ScoreRing score={university.overallScore} size={100} animated={false} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
