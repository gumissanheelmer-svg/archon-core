import { useState } from "react";
import { Plus, Trash2, Edit3, Brain, Lightbulb, BookOpen, Settings2, FileText } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useMemory, MemoryCategory, MemoryItem, MEMORY_CATEGORY_LABELS } from "@/hooks/useMemory";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CATEGORY_ICONS: Record<MemoryCategory, typeof Brain> = {
  identity: Brain,
  rules: Settings2,
  learnings: Lightbulb,
  preferences: BookOpen,
  context: FileText,
};

const Memory = () => {
  const { items, loading, createMemory, updateMemory, deleteMemory } = useMemory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MemoryItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MemoryItem | null>(null);
  const [formData, setFormData] = useState({
    category: "context" as MemoryCategory,
    content: "",
    priority: 3,
  });
  const [saving, setSaving] = useState(false);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({ category: "context", content: "", priority: 3 });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: MemoryItem) => {
    setEditingItem(item);
    setFormData({
      category: item.category,
      content: item.content,
      priority: item.priority,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.content.trim()) return;

    setSaving(true);
    try {
      if (editingItem) {
        // Update with versioning if content changed
        const contentChanged = editingItem.content !== formData.content;
        await updateMemory(editingItem.id, formData, contentChanged);
      } else {
        await createMemory(formData);
      }
      setIsDialogOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    await deleteMemory(deleteItem.id);
    setDeleteItem(null);
  };

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<MemoryCategory, MemoryItem[]>);

  const categoryOrder: MemoryCategory[] = ["identity", "rules", "preferences", "learnings", "context"];

  return (
    <AppLayout>
      <div className="min-h-screen px-6 py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-10 animate-fade-in-slow">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
                Memória
              </p>
              <h1 className="text-2xl font-semibold text-foreground">
                Memória Estratégica
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Conhecimento que o ARCHON utiliza em cada análise
              </p>
            </div>
            <Button
              onClick={handleOpenCreate}
              className="gap-2"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Empty State */}
          {!loading && items.length === 0 && (
            <div className="archon-card p-12 text-center animate-fade-in-slow">
              <Brain className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Memória Vazia
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Adicione itens de memória para que o ARCHON considere em todas as análises.
                Identidade do projeto, regras, aprendizados e preferências.
              </p>
              <Button onClick={handleOpenCreate} className="gap-2">
                <Plus className="w-4 h-4" />
                Criar Primeiro Item
              </Button>
            </div>
          )}

          {/* Memory Items by Category */}
          {!loading && items.length > 0 && (
            <div className="space-y-8">
              {categoryOrder.map((category) => {
                const categoryItems = groupedItems[category];
                if (!categoryItems || categoryItems.length === 0) return null;

                const Icon = CATEGORY_ICONS[category];

                return (
                  <div key={category} className="animate-fade-in-slow">
                    <div className="flex items-center gap-2 mb-4">
                      <Icon className="w-4 h-4 text-primary" />
                      <h2 className="text-sm font-medium text-foreground uppercase tracking-wider">
                        {MEMORY_CATEGORY_LABELS[category]}
                      </h2>
                      <span className="text-xs text-muted-foreground">
                        ({categoryItems.length})
                      </span>
                    </div>

                    <div className="space-y-2">
                      {categoryItems.map((item) => (
                        <div
                          key={item.id}
                          className="archon-card p-4 group"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-sm text-foreground leading-relaxed">
                                {item.content}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs text-muted-foreground">
                                  Prioridade: {item.priority}/5
                                </span>
                                {item.version > 1 && (
                                  <span className="text-xs text-muted-foreground">
                                    v{item.version}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleOpenEdit(item)}
                                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteItem(item)}
                                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Total Count */}
          {!loading && items.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-xs text-muted-foreground">
                {items.length} item{items.length !== 1 ? "s" : ""} na memória activa
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Editar Item" : "Novo Item de Memória"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
                Categoria
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value as MemoryCategory })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOrder.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {MEMORY_CATEGORY_LABELS[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
                Conteúdo
              </label>
              <Textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Ex: O tom do ARCHON é sempre silencioso, conciso e autoritário..."
                className="min-h-[120px] resize-none"
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {formData.content.length}/1000
              </p>
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
                Prioridade (1-5)
              </label>
              <Select
                value={String(formData.priority)}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: parseInt(value) })
                }
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((p) => (
                    <SelectItem key={p} value={String(p)}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={!formData.content.trim() || saving}
              >
                {saving ? "A guardar..." : editingItem ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Item</AlertDialogTitle>
            <AlertDialogDescription>
              Tens a certeza que queres eliminar este item de memória?
              O ARCHON deixará de considerar esta informação nas análises.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Memory;
