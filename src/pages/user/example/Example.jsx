import EmptyState from "../../../components/EmptyState";

const ExamplePage = () => {
    const PageName = "Example";

    return ( 
        <>
        <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-1">Data {PageName}</h2>
            <p className="text-gray-500 mb-4 text-sm">
                Seluruh data Data {PageName} tersedia disini
            </p>
            <div className="bg-white border rounded">
                <div className="flex justify-between items-center p-4 border-b">
                <div className="text-sm font-medium text-blue-600">Data {PageName}</div>
                <button className="bg-blue-500 text-white px-3 hover:bg-blue-700 transition py-1 rounded text-sm">
                    Tambah {PageName}
                </button>
                </div>
                <EmptyState page={PageName} to={"/example/tambah"} />
            </div>
        </div>
        
        </>
     );
}
 
export default ExamplePage;