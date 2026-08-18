"use client";

import * as React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus, Rocket, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createProject,
  updateProject,
  deleteProject,
  upsertLandingPageInfoBatch,
  LandingPageInfoMap,
  projectSchema,
  ProjectFormData,
} from "@/actions/landing";
import { uploadImage } from "@/actions/upload";
import { Project } from "@/generated/prisma/browser";

type ProjectsManagerProps = {
  initialData: Project[];
  sectionInfo: LandingPageInfoMap;
};

export default function ProjectsManager({
  initialData,
  sectionInfo,
}: ProjectsManagerProps) {
  const [projects, setProjects] = React.useState<Project[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | null>(
    null,
  );
  const [deletingProject, setDeletingProject] = React.useState<Project | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSectionLoading, setIsSectionLoading] = React.useState(false);
  const [isIconUploading, setIsIconUploading] = React.useState(false);
  const [tags, setTags] = React.useState<string[]>([]);
  const [newTag, setNewTag] = React.useState("");

  // Section header form
  const [sectionTitle, setSectionTitle] = React.useState(
    sectionInfo.projects_title ?? "Featured Projects",
  );
  const [sectionSubtitle, setSectionSubtitle] = React.useState(
    sectionInfo.projects_subtitle ??
      "Some of our recent work that we're proud of",
  );

  const onSubmitSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSectionLoading(true);
    try {
      await upsertLandingPageInfoBatch({
        projects_title: sectionTitle,
        projects_subtitle: sectionSubtitle,
      });
      toast.success("Section header saved successfully!");
    } catch (error) {
      console.error("Failed to save section:", error);
      toast.error("Failed to save section header");
    } finally {
      setIsSectionLoading(false);
    }
  };

  // Project form

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      iconUrl: "",
      order: 0,
      isActive: true,
    },
  });

  const watchIcon = watch("iconUrl");
  const watchIsActive = watch("isActive");

  const handleIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsIconUploading(true);
    try {
      const url = await uploadImage(file, "project-icon");
      setValue("iconUrl", url);
    } catch (error) {
      console.error("Failed to upload icon:", error);
      toast.error("Failed to upload icon");
    } finally {
      setIsIconUploading(false);
      e.target.value = "";
    }
  };

  const openCreateDialog = () => {
    setEditingProject(null);
    setTags([]);
    reset({
      title: "",
      description: "",
      tags: [],
      iconUrl: "",
      order: projects.length,
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setTags(project.tags);
    reset({
      title: project.title,
      description: project.description,
      tags: project.tags,
      iconUrl: project.iconUrl,
      order: project.order,
      isActive: project.isActive,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (project: Project) => {
    setDeletingProject(project);
    setIsDeleteDialogOpen(true);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);

    try {
      if (editingProject) {
        const updated = await updateProject(editingProject.id, {
          ...data,
          tags,
        });
        setProjects(
          projects.map((p) => (p.id === editingProject.id ? updated : p)),
        );
        toast.success("Project updated successfully!");
      } else {
        const created = await createProject({
          ...data,
          tags,
        });
        setProjects([...projects, created]);
        toast.success("Project created successfully!");
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save project:", error);
      toast.error("Failed to save project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProject) return;

    setIsLoading(true);
    try {
      await deleteProject(deletingProject.id);
      setProjects(projects.filter((p) => p.id !== deletingProject.id));
      setIsDeleteDialogOpen(false);
      toast.success("Project deleted successfully!");
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error("Failed to delete project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header Form */}
      <Card>
        <CardHeader>
          <CardTitle>Section Header</CardTitle>
          <CardDescription>
            Configure the title and subtitle displayed above the projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmitSection} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="section-title">Title</Label>
              <Input
                id="section-title"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="section-subtitle">Subtitle</Label>
              <Textarea
                id="section-subtitle"
                value={sectionSubtitle}
                onChange={(e) => setSectionSubtitle(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={isSectionLoading}>
              {isSectionLoading && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Save Section Header
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Projects List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              Manage the featured projects displayed on the landing page.
            </CardDescription>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 size-4" />
            Add Project
          </Button>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Rocket className="mb-4 size-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No projects yet</h3>
              <p className="text-sm text-muted-foreground">
                Add your first project to showcase on the landing page.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Icon</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Tags</TableHead>
                  <TableHead className="w-12">Order</TableHead>
                  <TableHead className="w-20">Active</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => {
                  return (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div className="flex size-8 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-primary">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={project.iconUrl}
                            alt={project.title}
                            className="size-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{project.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {project.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {project.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{project.order}</TableCell>
                      <TableCell>
                        {project.isActive ? (
                          <Badge>Active</Badge>
                        ) : (
                          <Badge variant="outline">Hidden</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(project)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(project)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "Add Project"}
            </DialogTitle>
            <DialogDescription>
              {editingProject
                ? "Update the project details."
                : "Add a new project to showcase on the landing page."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")} />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  min={0}
                  {...register("order", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="iconUrl">Icon</Label>
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-primary">
                  {watchIcon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={watchIcon}
                      alt="Icon preview"
                      className="size-full object-cover"
                    />
                  ) : (
                    <Rocket className="size-4" />
                  )}
                </div>
                <Input
                  id="iconUrl"
                  type="file"
                  accept="image/*"
                  disabled={isIconUploading}
                  onChange={handleIconChange}
                />
                {isIconUploading && (
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {errors.iconUrl && (
                <p className="text-sm text-destructive">
                  {errors.iconUrl.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Show on landing page</Label>
                <p className="text-sm text-muted-foreground">
                  Only active projects are displayed to visitors.
                </p>
              </div>
              <Switch
                id="isActive"
                checked={watchIsActive}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  <Plus className="size-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 pr-1.5"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || isIconUploading}>
                {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                {editingProject ? "Save Changes" : "Add Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingProject?.title}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
