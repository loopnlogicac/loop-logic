import java.nio.file.Path;
import java.nio.file.Files;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;
import java.nio.file.StandardOpenOption;

class Main {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        String first = input.next();
        String second = input.next();
        Path file = Files.createTempFile("oop-append-", ".txt");
        try {
            Files.writeString(file, first + "\n", StandardCharsets.UTF_8);
            Files.writeString(file, second + "\n", StandardCharsets.UTF_8,
                    StandardOpenOption.APPEND);
            System.out.print(Files.readString(file, StandardCharsets.UTF_8));
        } finally {
            Files.deleteIfExists(file);
        }
    }
}
