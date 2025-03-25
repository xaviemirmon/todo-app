

function App() {
  return (
    <div className='flex bg-blue-600 justify-center items-center size-full'>
      <div className="bg-white rounded-lg h-128 min-w-96 p-8">
        <form className='flex flex-col gap-4'>
          <input type="text" className="border border-gray-300 px-4 py-2 rounded" placeholder="Add new todo" />
          <button type="submit" className="border border-gray-300 text-black px-4 py-2 rounded text-sm hover:bg-green-500 hover:text-white">Add Todo</button>
        </form>
      </div>

    </div>
  )
}

export default App
