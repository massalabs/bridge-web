import { Table } from './Table';

export function HistoryPage() {
  return (
    <div className="flex w-screen h-fit p-10 items-center justify-center">
      {/* might refactor this for better readability */}
      <Table />
    </div>
  );
}

// TODO: Table component (receive 1 to n operations) -> objective = pagination and display operation history
// TODO: Operation component ->  objective = display operation details
// TODO: set max hight for table and add paginations
