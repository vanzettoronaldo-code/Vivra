import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Mail, Trash2, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  joinedAt: string;
}

export default function Team() {
  const { language } = useLanguage();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Ronaldo Vanzetto",
      email: "vanzettoronaldo@gmail.com",
      role: "admin",
      joinedAt: "2025-01-01",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<"admin" | "user">("user");

  const handleAddMember = () => {
    if (!newMemberEmail) return;

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newMemberEmail.split("@")[0],
      email: newMemberEmail,
      role: newMemberRole,
      joinedAt: new Date().toISOString().split("T")[0],
    };

    setTeamMembers([...teamMembers, newMember]);
    setNewMemberEmail("");
    setNewMemberRole("user");
    setIsOpen(false);
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id));
  };

  const handleChangeRole = (id: string, newRole: "admin" | "user") => {
    setTeamMembers(
      teamMembers.map((member) =>
        member.id === id ? { ...member, role: newRole } : member
      )
    );
  };

  const isPortuguese = language === "pt-BR";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isPortuguese ? "Equipe" : "Team"}
          </h1>
          <p className="text-slate-600 mt-1">
            {isPortuguese
              ? "Gerencie os membros da sua equipe e permissões"
              : "Manage your team members and permissions"}
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              {isPortuguese ? "Adicionar Membro" : "Add Member"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isPortuguese ? "Adicionar Novo Membro" : "Add New Member"}
              </DialogTitle>
              <DialogDescription>
                {isPortuguese
                  ? "Convide um novo membro para sua equipe"
                  : "Invite a new member to your team"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  {isPortuguese ? "Email" : "Email"}
                </label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  {isPortuguese ? "Função" : "Role"}
                </label>
                <Select value={newMemberRole} onValueChange={(value: any) => setNewMemberRole(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">
                      {isPortuguese ? "Usuário" : "User"}
                    </SelectItem>
                    <SelectItem value="admin">
                      {isPortuguese ? "Administrador" : "Admin"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddMember} className="w-full">
                {isPortuguese ? "Enviar Convite" : "Send Invite"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Members Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {isPortuguese ? "Membros da Equipe" : "Team Members"}
          </CardTitle>
          <CardDescription>
            {isPortuguese
              ? `${teamMembers.length} membro(s) na sua equipe`
              : `${teamMembers.length} member(s) in your team`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">
                    {isPortuguese ? "Nome" : "Name"}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">
                    {isPortuguese ? "Email" : "Email"}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">
                    {isPortuguese ? "Função" : "Role"}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">
                    {isPortuguese ? "Adicionado em" : "Added"}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">
                    {isPortuguese ? "Ações" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-900 font-medium">
                      {member.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {member.email}
                    </td>
                    <td className="py-3 px-4">
                      <Select
                        value={member.role}
                        onValueChange={(value: any) =>
                          handleChangeRole(member.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">
                            {isPortuguese ? "Usuário" : "User"}
                          </SelectItem>
                          <SelectItem value="admin">
                            {isPortuguese ? "Admin" : "Admin"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-sm">
                      {new Date(member.joinedAt).toLocaleDateString(
                        isPortuguese ? "pt-BR" : "en-US"
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                        title={isPortuguese ? "Remover membro" : "Remove member"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Shield className="w-5 h-5" />
            {isPortuguese ? "Permissões" : "Permissions"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-900 space-y-2">
          <div>
            <p className="font-semibold">
              {isPortuguese ? "Administrador" : "Admin"}
            </p>
            <p className="text-sm text-blue-800">
              {isPortuguese
                ? "Acesso total a todas as funcionalidades e configurações"
                : "Full access to all features and settings"}
            </p>
          </div>
          <div>
            <p className="font-semibold">
              {isPortuguese ? "Usuário" : "User"}
            </p>
            <p className="text-sm text-blue-800">
              {isPortuguese
                ? "Acesso limitado a ativos e registros atribuídos"
                : "Limited access to assigned assets and records"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
