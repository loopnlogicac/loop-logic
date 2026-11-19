import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;
import java.io.BufferedReader;
import java.io.BufferedWriter;



class Main {
    public static void main(String[] args) throws Exception {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            Path path = Files.createTempFile("sum-", ".txt");
            try {
                try (BufferedWriter writer =
                    Files.newBufferedWriter(path, StandardCharsets.UTF_8)) {
                    for (int i = 0; i < n; i++) {
                        writer.write(Integer.toString(input.nextInt()));
                        writer.newLine();
                    }
                }
                int sum = 0;
                try (BufferedReader reader =
                    Files.newBufferedReader(path, StandardCharsets.UTF_8)) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        sum += Integer.parseInt(line);
                    }
                }
                System.out.println(sum);
            } finally { Files.deleteIfExists(path); }
        }
    }
}
