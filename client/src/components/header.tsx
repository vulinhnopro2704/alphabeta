import { Logo, Streak, Diamond, Heart } from "."

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md shadow-amber-50">
      {/*Logo*/}
      <Logo className="h-10 w-40" />

      <div className="flex items-center space-x-4">
        {/* Streaks */}
        <Streak variant="filled" />

        {/* Diamond */}
        <Diamond />

        {/* Hear */}
        <Heart />

        {/* Profile */}
        <div>
          <img src="" alt="" />
        </div>
      </div>
    </header>
  )
}
