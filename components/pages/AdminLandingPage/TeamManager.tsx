"use client";

import * as React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus, Trash2, Users } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  upsertLandingPageInfoBatch,
  LandingPageInfoMap,
  teamMemberSchema,
  TeamMemberFormData,
} from "@/actions/landing";
import { TeamMember } from "@/generated/prisma/browser";

type TeamManagerProps = {
  initialData: TeamMember[];
  sectionInfo: LandingPageInfoMap;
};

export default function TeamManager({
  initialData,
  sectionInfo,
}: TeamManagerProps) {
  const [members, setMembers] = React.useState<TeamMember[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [editingMember, setEditingMember] = React.useState<TeamMember | null>(
    null,
  );
  const [deletingMember, setDeletingMember] = React.useState<TeamMember | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSectionLoading, setIsSectionLoading] = React.useState(false);

  // Section header form
  const [sectionBadge, setSectionBadge] = React.useState(
    sectionInfo.team_badge ?? "Our Team"
  );
  const [sectionTitle, setSectionTitle] = React.useState(
    sectionInfo.team_title ?? "Meet the Developers"
  );
  const [sectionSubtitle, setSectionSubtitle] = React.useState(
    sectionInfo.team_subtitle ?? "Young, passionate, and always learning"
  );

  const onSubmitSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSectionLoading(true);
    try {
      await upsertLandingPageInfoBatch({
        team_badge: sectionBadge,
        team_title: sectionTitle,
        team_subtitle: sectionSubtitle,
      });
      toast.success("Section header saved successfully!");
    } catch (error) {
      console.error("Failed to save section:", error);
      toast.error("Failed to save section header");
    } finally {
      setIsSectionLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      role: "",
      avatar: "",
      initials: "",
      github: "",
      order: 0,
    },
  });

  const watchName = watch("name");

  // Auto-generate initials from name
  React.useEffect(() => {
    if (!editingMember && watchName) {
      const parts = watchName.trim().split(/\s+/);
      const initials = parts
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("");
      setValue("initials", initials);
    }
  }, [watchName, editingMember, setValue]);

  const openCreateDialog = () => {
    setEditingMember(null);
    reset({
      name: "",
      role: "",
      avatar: "",
      initials: "",
      github: "",
      order: members.length,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (member: TeamMember) => {
    setEditingMember(member);
    reset({
      name: member.name,
      role: member.role,
      avatar: member.avatar || "",
      initials: member.initials,
      github: member.github || "",
      order: member.order,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (member: TeamMember) => {
    setDeletingMember(member);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = async (data: TeamMemberFormData) => {
    setIsLoading(true);

    try {
      const memberData = {
        name: data.name,
        role: data.role,
        avatar: data.avatar || undefined,
        initials: data.initials,
        github: data.github || undefined,
        order: data.order,
      };

      if (editingMember) {
        const updated = await updateTeamMember(editingMember.id, memberData);
        setMembers(
          members.map((m) => (m.id === editingMember.id ? updated : m)),
        );
        toast.success("Team member updated successfully!");
      } else {
        const created = await createTeamMember(memberData);
        setMembers([...members, created]);
        toast.success("Team member added successfully!");
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save team member:", error);
      toast.error("Failed to save team member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingMember) return;

    setIsLoading(true);
    try {
      await deleteTeamMember(deletingMember.id);
      setMembers(members.filter((m) => m.id !== deletingMember.id));
      setIsDeleteDialogOpen(false);
      toast.success("Team member deleted successfully!");
    } catch (error) {
      console.error("Failed to delete team member:", error);
      toast.error("Failed to delete team member");
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
            Configure the badge, title, and subtitle displayed above the team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmitSection} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team-badge">Badge Text</Label>
              <Input
                id="team-badge"
                value={sectionBadge}
                onChange={(e) => setSectionBadge(e.target.value)}
                placeholder="Our Team"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-title">Title</Label>
              <Input
                id="team-title"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-subtitle">Subtitle</Label>
              <Textarea
                id="team-subtitle"
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

      {/* Team Members List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Manage the team members displayed on the landing page.
            </CardDescription>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 size-4" />
            Add Member
          </Button>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-4 size-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No team members yet</h3>
              <p className="text-sm text-muted-foreground">
                Add team members to introduce your team on the landing page.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">GitHub</TableHead>
                  <TableHead className="w-12">Order</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage
                          src={member.avatar || ""}
                          alt={member.name}
                        />
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.role}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {member.github ? (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {member.github.replace("https://github.com/", "@")}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{member.order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(member)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(member)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Edit Team Member" : "Add Team Member"}
            </DialogTitle>
            <DialogDescription>
              {editingMember
                ? "Update the team member details."
                : "Add a new team member to display on the landing page."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="initials">Initials</Label>
                <Input id="initials" maxLength={3} {...register("initials")} />
                {errors.initials && (
                  <p className="text-sm text-destructive">
                    {errors.initials.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                placeholder="Full Stack Developer"
                {...register("role")}
              />
              {errors.role && (
                <p className="text-sm text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL (optional)</Label>
              <Input
                id="avatar"
                placeholder="https://example.com/avatar.jpg"
                {...register("avatar")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github">GitHub URL (optional)</Label>
              <Input
                id="github"
                placeholder="https://github.com/username"
                {...register("github")}
              />
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
                {editingMember ? "Save Changes" : "Add Member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove &quot;{deletingMember?.name}&quot;
              from the team? This action cannot be undone.
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
