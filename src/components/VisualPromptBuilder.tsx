import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import { FaTrash, FaTextHeight, FaImage, FaGripVertical } from "react-icons/fa";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Define the structure of a prompt block
export interface PromptBlock {
  id: string;
  type: "text" | "image";
  content: string | null;
}

interface VisualPromptBuilderProps {
  blocks: PromptBlock[];
  onBlocksChange: (blocks: PromptBlock[]) => void;
}

// New component for each sortable block
const SortableBlock = ({
  block,
  index,
  onUpdate,
  onRemove,
  onImageUpload,
}: {
  block: PromptBlock;
  index: number;
  onUpdate: (id: string, content: string) => void;
  onRemove: (id: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <Button
              variant="light"
              {...listeners}
              className="me-2 p-2"
              style={{ cursor: "grab" }}
              title="Pindahkan Blok"
            >
              <FaGripVertical />
            </Button>
            {block.type === "text" ? (
              <Form.Control
                as="textarea"
                placeholder={`Blok Teks #${index + 1}`}
                value={block.content || ""}
                onChange={(e) => onUpdate(block.id, e.target.value)}
                rows={3}
              />
            ) : (
              <div className="w-100">
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onImageUpload(e, block.id)
                  }
                />
                {block.content && (
                  <img
                    src={block.content}
                    alt="Preview"
                    className="mt-2"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                    }}
                  />
                )}
              </div>
            )}
            <Button
              variant="outline-danger"
              onClick={() => onRemove(block.id)}
              className="ms-2"
              title="Hapus Blok"
            >
              <FaTrash />
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

const VisualPromptBuilder: React.FC<VisualPromptBuilderProps> = ({
  blocks,
  onBlocksChange,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const addBlock = (type: "text" | "image") => {
    const newBlock: PromptBlock = {
      id: `block-${Date.now()}`,
      type,
      content: "",
    };
    onBlocksChange([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    onBlocksChange(blocks.filter((block) => block.id !== id));
  };

  const updateBlockContent = (id: string, content: string) => {
    onBlocksChange(
      blocks.map((block) => (block.id === id ? { ...block, content } : block)),
    );
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateBlockContent(id, event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      onBlocksChange(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  return (
    <div className="visual-prompt-builder">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
          {blocks.map((block, index) => (
            <SortableBlock
              key={block.id}
              block={block}
              index={index}
              onUpdate={updateBlockContent}
              onRemove={removeBlock}
              onImageUpload={handleImageUpload}
            />
          ))}
        </SortableContext>
      </DndContext>
      <div className="d-flex justify-content-end mt-3">
        <Button
          variant="outline-secondary"
          onClick={() => addBlock("text")}
          className="me-2"
        >
          <FaTextHeight className="me-2" />
          Tambah Blok Teks
        </Button>
        <Button variant="outline-secondary" onClick={() => addBlock("image")}>
          <FaImage className="me-2" />
          Tambah Blok Gambar
        </Button>
      </div>
    </div>
  );
};

export default VisualPromptBuilder;
