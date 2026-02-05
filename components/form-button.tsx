interface IFormButtonProps {
  loading: boolean;
  text: string;
}

export default function FormButton({ loading, text }: IFormButtonProps) {
  return (
    <button
      className="btn-primary h-10 disabled:bg-neutral-400 disabled:text-neutral-300 
        disabled:cursor-not-allowed
        "
      disabled={loading}
    >
      {loading ? "로딩 중..." : text}
    </button>
  );
}
