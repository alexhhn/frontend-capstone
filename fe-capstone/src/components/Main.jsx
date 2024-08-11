import BookingForm from './BookingForm';
function Main() {
	return (
		<main>
			<section className="content">
				<h2>Welcome to Little Lemon</h2>
				<p>Enjoy the best homemade meals in a cozy atmosphere.</p>
			</section>
			<section className="content">
				<h2>Our Menu</h2>
				<p>
					Explore our wide variety of dishes made from fresh, local ingredients.
				</p>
			</section>
			<section className="content">
				BookingForm
				<BookingForm></BookingForm>
			</section>
		</main>
	);
}

export default Main;
