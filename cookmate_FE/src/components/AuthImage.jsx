export default function AuthImage() {
    return (
        <>
            <div className="auth-image">
                <div className="background-image"></div>
                <div className="image-overlay" />
                <div className="brand">
                    <div className="mb-3">
                        <img src="/image/barbecue.png" alt="" className="img-fluid brand-icon" />
                    </div>
                    <h5>CookMate</h5>
                </div>
            </div>
        </>
    )
}