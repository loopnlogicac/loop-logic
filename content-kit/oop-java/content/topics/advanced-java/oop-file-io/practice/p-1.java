import java.nio.file.Path;
import java.nio.file.Files;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

class Main {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        int n = input.nextInt();
        Path file = Files.createTempFile("oop-marks-", ".txt");
        try {
            StringBuilder text = new StringBuilder();
            for (int i = 0; i < n; i++) { text.append(input.nextInt()).append('\n'); }
            Files.writeString(file, text, StandardCharsets.UTF_8);
            int sum = 0;
            for (String line : Files.readAllLines(file, StandardCharsets.UTF_8)) {
                sum += Integer.parseInt(line);
            }
            System.out.println(sum);
        } finally {
            Files.deleteIfExists(file);
        }
    }
}
