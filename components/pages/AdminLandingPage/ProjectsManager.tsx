"use client";

import * as React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Code,
  Globe,
  Loader2,
  Pencil,
  Plus,
  Rocket,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

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
import { Project } from "@/generated/prisma/browser";

const iconOptions = [
  { value: "rocket", label: "Rocket", Icon: Rocket },
  { value: "sparkles", label: "Sparkles", Icon: Sparkles },
  { value: "globe", label: "Globe", Icon: Globe },
  { value: "code", label: "Code", Icon: Code },
];

const getIconComponent = (iconName: string) => {
  const icon = iconOptions.find((i) => i.value === iconName);
  return icon?.Icon || Rocket;
};

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
  const [tags, setTags] = React.useState<string[]>([]);
  const [newTag, setNewTag] = React.useState("");

  // Section header form
  const [sectionTitle, setSectionTitle] = React.useState(
    sectionInfo.projects_title ?? "Featured Projects"
  );
  const [sectionSubtitle, setSectionSubtitle] = React.useState(
    sectionInfo.projects_subtitle ?? "Some of our recent work that we're proud of"
  );

  const onSubmitSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSectionLoading(true);
    try {
      await upsertLandingPageInfoBatch({
        projects_title: sectionTitle,
        projects_subtitle: sectionSubtitle,
      });
    } catch (error) {
      console.error("Failed to save section:", error);
    } finally {
      setIsSectionLoading(false);
    }
  };

  // Project form

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      icon: "rocket",
      order: 0,
    },
  });

  const openCreateDialog = () => {
    setEditingProject(null);
    setTags([]);
    reset({
      title: "",
      description: "",
      tags: [],
      icon: "rocket",
      order: projects.length,
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
      icon: project.icon,
      order: project.order,
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
      } else {
        const created = await createProject({
          ...data,
          tags,
        });
        setProjects([...projects, created]);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save project:", error);
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
    } catch (error) {
      console.error("Failed to delete project:", error);
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
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => {
                  const IconComponent = getIconComponent(project.icon);
                  return (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <IconComponent className="size-4" />
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
              <Label>Icon</Label>
              <div className="grid grid-cols-4 gap-2">
                {iconOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex flex-col gap-1 h-auto py-2"
                    onClick={() => setValue("icon", option.value)}
                  >
                    <option.Icon className="size-4" />
                    <span className="text-xs">{option.label}</span>
                  </Button>
                ))}
              </div>
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
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1.5">
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
              <Button type="submit" disabled={isLoading}>
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
