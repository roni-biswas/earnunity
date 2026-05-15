export interface JobItem {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: "Social" | "Review" | "Survey" | "Video";
  thumbnail: string;
  status: "active" | "completed";
}
