type AppIconMarkupProps = {
  size: number
}

export const AppIconMarkup = ({ size }: AppIconMarkupProps) => {
  const micSize = Math.round(size * 0.34)

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #2a2840 0%, #1d1c2d 55%, #151421 100%)",
        borderRadius: Math.round(size * 0.22),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: Math.round(size * 0.58),
          height: Math.round(size * 0.58),
          borderRadius: 9999,
          background: "linear-gradient(160deg, #fb7185 0%, #f43f5e 100%)",
          boxShadow: "0 18px 40px rgba(244, 63, 94, 0.35)",
        }}
      >
        <svg
          width={micSize}
          height={micSize}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z"
            fill="white"
          />
          <path
            d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-3.08A7 7 0 0 0 19 11Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  )
}
