import Link from "next/link";

export default function Home() {
  const pages = [
    {
      route: "/reports/points-done-by-classification",
      description:
        "Pie chart displaying the proportion of story points for completed tickets by classification for a given period of time.",
    },
    {
      route: "/charts/mbr",
      description:
        "Pie charts used in the MBR indicating the proportion of story points completed by classification for the previous and current month.",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <table className="border-collapse">
        <thead>
          <tr>
            <th>Route</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.route} className="even:bg-gray-200 odd:bg-gray-50">
              <td className="border px-5">
                <Link href={page.route}>{page.route}</Link>
              </td>
              <td className="border px-5">{page.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
