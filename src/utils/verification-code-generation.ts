export default function generateVerificationCode() {
  var random_string = "";
  var characters = "0123456789";

  for (var i = 0; i < 4; i++) {
    random_string += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return random_string;
}
