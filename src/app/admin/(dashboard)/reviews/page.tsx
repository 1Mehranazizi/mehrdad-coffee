import { listReviewsForAdmin } from "@/server/repo/reviews";
import ReviewModerationRow from "@/components/admin/ReviewModerationRow";

export default function AdminReviewsPage() {
  const reviews = listReviewsForAdmin();
  const pending = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink mb-6">نظرات مشتریان</h1>

      <h2 className="text-sm font-semibold text-ink-soft mb-3">
        در انتظار تایید ({pending.length})
      </h2>
      <div className="space-y-3 mb-8">
        {pending.map((r) => (
          <ReviewModerationRow key={r.id} review={r} />
        ))}
        {pending.length === 0 && (
          <p className="text-sm text-ink-soft">نظری در انتظار تایید نیست.</p>
        )}
      </div>

      <h2 className="text-sm font-semibold text-ink-soft mb-3">
        تایید شده ({approved.length})
      </h2>
      <div className="space-y-3">
        {approved.map((r) => (
          <ReviewModerationRow key={r.id} review={r} />
        ))}
      </div>
    </div>
  );
}
