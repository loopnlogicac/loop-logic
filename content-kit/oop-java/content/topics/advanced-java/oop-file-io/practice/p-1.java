import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;



class Main {
    public static void main(String[] args) throws Exception {
        try (Scanner input = new Scanner(System.in)) {
            String text = input.nextLine();
            Path path = Files.createTempFile("line-", ".txt");
            try {
                Files.writeString(path, text, StandardCharsets.UTF_8);
                System.out.println(Files.readString(path, StandardCharsets.UTF_8));
            } finally { Files.deleteIfExists(path); }
        }
    }
}
