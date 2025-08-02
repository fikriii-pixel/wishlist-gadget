// components/DeleteForm.tsx
"use client";

type Props = {
  id: string;
};

export default function DeleteForm({ id }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    if (!confirm("Yakin ingin menghapus gadget ini?")) {
      e.preventDefault();
    }
  };

  return (
    <form
      action={`/api/gadget/${id}`}
      method="POST"
      onSubmit={handleSubmit}
      className="inline-block"
    >
      <input type="hidden" name="_method" value="DELETE" />
      <button type="submit" className="text-red-600 text-sm">
        Hapus
      </button>
    </form>
  );
}
