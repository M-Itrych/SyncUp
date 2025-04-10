"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Role, Server } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  AlertCircle, 
  Check, 
  Loader2, 
  Plus, 
  Edit2, 
  Trash2, 
  ShieldAlert 
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface ServerRolesFormProps {
  server: Server;
  roles: Role[];
  isOwner: boolean;
}

const AVAILABLE_PERMISSIONS = [
  { id: "can_invite", label: "Can Invite Members" },
  { id: "can_create_channels", label: "Can Create Channels" },
  { id: "can_edit_server", label: "Can Edit Server" },
  {id: "delete_message", label: "Can Delete Any Message"},
  { id: "is_admin", label: "Administrator" },
];

const ServerRolesForm = ({ server, roles, isOwner }: ServerRolesFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [serverRoles, setServerRoles] = useState<Role[]>(roles);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleCreateDialog = () => {
    setIsCreating(true);
    setEditingRoleId(null);
    setRoleName("");
    setSelectedPermissions([]);
  };

  const handleEditDialog = (role: Role) => {
    setIsCreating(false);
    setEditingRoleId(role.id);
    setRoleName(role.name);
    const permissionsArray = role.permissions ? role.permissions.split(",").filter(Boolean) : [];
    setSelectedPermissions(permissionsArray);
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };
  const handleSubmitRole = async () => {
    if (!roleName.trim()) {
      setError("Role name is required");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      const permissionsString = selectedPermissions.join(",");
      
      if (isCreating) {
        const response = await axios.post(`/api/server/${server.id}/roles`, {
          name: roleName,
          permissions: permissionsString
        });
        
        setServerRoles(prev => [...prev, response.data]);
      } else if (editingRoleId) {
        const response = await axios.patch(`/api/server/${server.id}/roles/${editingRoleId}`, {
          name: roleName,
          permissions: permissionsString
        });
        
        setServerRoles(prev => 
          prev.map(role => role.id === editingRoleId ? response.data : role)
        );
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      router.refresh();
    } catch (error) {
      setError("Failed to save role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleDeleteRole = async (roleId: string) => {
    try {
      setIsLoading(true);
      
      await axios.delete(`/api/server/${server.id}/roles/${roleId}`);
      
      setServerRoles(prev => prev.filter(role => role.id !== roleId));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      router.refresh();
    } catch (error) {
      setError("Failed to delete role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const formatPermissions = (permissionsString: string) => {
    if (!permissionsString) return [];
    
    const permissions = permissionsString.split(",").filter(Boolean);
    return permissions.map(permission => {
      const found = AVAILABLE_PERMISSIONS.find(p => p.id === permission);
      return found ? found.label : permission;
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Server Roles</CardTitle>
            <CardDescription>
              Create and manage roles to control permissions for server members.
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                onClick={handleCreateDialog}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Role
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {isCreating ? "Create New Role" : "Edit Role"}
                </DialogTitle>
                <DialogDescription>
                  {isCreating 
                    ? "Add a new role to your server with specific permissions." 
                    : "Edit role name and permissions."}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="roleName" className="text-sm font-medium">
                    Role Name
                  </Label>
                  <Input
                    id="roleName"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="Enter role name"
                    className="w-full"
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Permissions
                  </Label>
                  
                  {AVAILABLE_PERMISSIONS.map((permission) => (
                    <div 
                      key={permission.id} 
                      className="flex items-center space-x-2 rounded-md border p-3"
                    >
                      <Checkbox
                        id={permission.id}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id)}
                      />
                      <Label
                        htmlFor={permission.id}
                        className="text-sm font-medium cursor-pointer flex-1"
                      >
                        {permission.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <DialogFooter className="flex items-center justify-between">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button 
                    disabled={isLoading}
                    onClick={handleSubmitRole}
                    className="bg-violet-600 hover:bg-violet-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : isCreating ? "Create Role" : "Update Role"}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-6 bg-rose-500/15">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-emerald-500/15">
            <Check className="h-4 w-4 text-emerald-500" />
            <AlertDescription className="text-emerald-500">
              Role updated successfully!
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          {serverRoles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No roles created yet. Create your first role to manage server permissions.
            </div>
          ) : (
            serverRoles.map((role) => (
              <div 
                key={role.id} 
                className="flex items-center justify-between p-4 rounded-lg border bg-background hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <ShieldAlert className="h-5 w-5 text-violet-500" />
                  <div>
                    <h3 className="font-medium">{role.name}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formatPermissions(role.permissions).map((permission, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs bg-violet-100 dark:bg-violet-900/20 text-violet-800 dark:text-violet-300"
                        >
                          {permission}
                        </Badge>
                      ))}
                      {!role.permissions && (
                        <span className="text-xs text-muted-foreground">
                          No permissions
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEditDialog(role)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          Edit Role
                        </DialogTitle>
                        <DialogDescription>
                          Edit role name and permissions.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="roleNameEdit" className="text-sm font-medium">
                            Role Name
                          </Label>
                          <Input
                            id="roleNameEdit"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="Enter role name"
                            className="w-full"
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">
                            Permissions
                          </Label>
                          
                          {AVAILABLE_PERMISSIONS.map((permission) => (
                            <div 
                              key={permission.id} 
                              className="flex items-center space-x-2 rounded-md border p-3"
                            >
                              <Checkbox
                                id={`edit-${permission.id}`}
                                checked={selectedPermissions.includes(permission.id)}
                                onCheckedChange={() => togglePermission(permission.id)}
                              />
                              <Label
                                htmlFor={`edit-${permission.id}`}
                                className="text-sm font-medium cursor-pointer flex-1"
                              >
                                {permission.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <DialogFooter className="flex items-center justify-between">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button 
                            disabled={isLoading}
                            onClick={handleSubmitRole}
                            className="bg-violet-600 hover:bg-violet-700 text-white"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : "Update Role"}
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-rose-500 border-rose-200 hover:bg-rose-100 hover:text-rose-700 dark:border-rose-800 dark:hover:bg-rose-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-rose-500">
                          Delete Role
                        </DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete the role "{role.name}"? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <DialogFooter className="flex items-center justify-between mt-4">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button 
                            disabled={isLoading}
                            onClick={() => handleDeleteRole(role.id)}
                            variant="destructive"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                              </>
                            ) : "Delete Role"}
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { ServerRolesForm };